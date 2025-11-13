import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    const { action, userData } = await req.json()

    switch (action) {
      case 'register':
        // Criar usuário no auth
        const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true
        })

        if (authError) throw authError

        // Criar perfil do usuário
        const { error: profileError } = await supabaseClient
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role || 'user',
            company: userData.company,
            phone: userData.phone
          })

        if (profileError) throw profileError

        return new Response(
          JSON.stringify({ success: true, user: authData.user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'login':
        const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        })

        if (loginError) throw loginError

        // Atualizar último login
        await supabaseClient
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', loginData.user.id)

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: loginData.user, 
            session: loginData.session 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-profile':
        const { data: profile, error: profileFetchError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileFetchError) throw profileFetchError

        return new Response(
          JSON.stringify({ success: true, profile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update-profile':
        const { error: updateError } = await supabaseClient
          .from('users')
          .update({
            full_name: userData.full_name,
            company: userData.company,
            phone: userData.phone,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})