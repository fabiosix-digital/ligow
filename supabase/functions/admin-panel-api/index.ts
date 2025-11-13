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

    // Verificar se usuário é admin
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userProfile || !['admin', 'manager'].includes(userProfile.role)) {
      throw new Error('Access denied - Admin privileges required')
    }

    const { action, data: requestData } = await req.json()

    switch (action) {
      case 'get-dashboard-stats':
        // Estatísticas gerais do sistema
        const { data: allUsers } = await supabaseClient
          .from('users')
          .select('*')

        const { data: allCampaigns } = await supabaseClient
          .from('campaigns')
          .select('*')

        const { data: allCalls } = await supabaseClient
          .from('call_logs')
          .select('*')

        const { data: allAgents } = await supabaseClient
          .from('agents')
          .select('*')

        const stats = {
          total_users: allUsers?.length || 0,
          active_users: allUsers?.filter(u => u.status === 'active').length || 0,
          total_campaigns: allCampaigns?.length || 0,
          active_campaigns: allCampaigns?.filter(c => c.status === 'active').length || 0,
          total_calls: allCalls?.length || 0,
          successful_calls: allCalls?.filter(c => c.status === 'completed').length || 0,
          total_agents: allAgents?.length || 0,
          active_agents: allAgents?.filter(a => a.status === 'active').length || 0,
          total_revenue: allCalls?.reduce((sum, call) => sum + (call.cost || 0), 0) || 0,
          avg_call_duration: allCalls?.length ? 
            allCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / allCalls.length : 0
        }

        return new Response(
          JSON.stringify({ success: true, stats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-all-users':
        const { data: users, error: usersError } = await supabaseClient
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) throw usersError

        return new Response(
          JSON.stringify({ success: true, users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update-user-status':
        const { error: statusError } = await supabaseClient
          .from('users')
          .update({ 
            status: requestData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestData.user_id)

        if (statusError) throw statusError

        return new Response(
          JSON.stringify({ success: true, message: 'Status atualizado com sucesso' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update-user-role':
        const { error: roleError } = await supabaseClient
          .from('users')
          .update({ 
            role: requestData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestData.user_id)

        if (roleError) throw roleError

        return new Response(
          JSON.stringify({ success: true, message: 'Função atualizada com sucesso' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'delete-user':
        // Deletar usuário do auth
        const { error: authDeleteError } = await supabaseClient.auth.admin.deleteUser(
          requestData.user_id
        )

        if (authDeleteError) throw authDeleteError

        return new Response(
          JSON.stringify({ success: true, message: 'Usuário deletado com sucesso' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-system-logs':
        // Buscar logs recentes do sistema
        const { data: recentCalls } = await supabaseClient
          .from('call_logs')
          .select(`
            *,
            campaigns(name),
            agents(name),
            users(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(50)

        return new Response(
          JSON.stringify({ success: true, logs: recentCalls }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-revenue-analytics':
        // Análise de receita por período
        const { data: callsRevenue } = await supabaseClient
          .from('call_logs')
          .select('cost, created_at')
          .order('created_at', { ascending: true })

        // Agrupar por dia
        const revenueByDay = {}
        callsRevenue?.forEach(call => {
          const date = new Date(call.created_at).toISOString().split('T')[0]
          revenueByDay[date] = (revenueByDay[date] || 0) + (call.cost || 0)
        })

        return new Response(
          JSON.stringify({ success: true, revenue: revenueByDay }),
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