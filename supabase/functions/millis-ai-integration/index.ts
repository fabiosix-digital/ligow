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

    const { action, data: requestData } = await req.json()

    // Simular integração com MillisAI API
    const MILLIS_API_BASE = 'https://api.millis.ai/v1'
    const MILLIS_API_KEY = Deno.env.get('MILLIS_API_KEY') || 'demo_key_123'

    switch (action) {
      case 'create-agent':
        // Simular criação de agente na MillisAI
        const agentResponse = await fetch(`${MILLIS_API_BASE}/agents`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MILLIS_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: requestData.name,
            voice_id: requestData.voice_id,
            language: requestData.language,
            personality: requestData.personality,
            instructions: requestData.instructions
          })
        })

        // Para demo, simular resposta da API
        const millisAgentId = `millis_agent_${Date.now()}`

        // Salvar agente no banco
        const { data: agent, error: agentError } = await supabaseClient
          .from('agents')
          .insert({
            name: requestData.name,
            description: requestData.description,
            voice_id: requestData.voice_id,
            language: requestData.language,
            personality: requestData.personality,
            instructions: requestData.instructions,
            user_id: user.id,
            millis_agent_id: millisAgentId,
            status: 'active'
          })
          .select()
          .single()

        if (agentError) throw agentError

        return new Response(
          JSON.stringify({ success: true, agent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'start-campaign':
        // Simular início de campanha
        const campaignId = requestData.campaign_id

        // Atualizar status da campanha
        const { error: campaignError } = await supabaseClient
          .from('campaigns')
          .update({
            status: 'active',
            started_at: new Date().toISOString()
          })
          .eq('id', campaignId)

        if (campaignError) throw campaignError

        // Simular chamadas da MillisAI
        const callResponse = await fetch(`${MILLIS_API_BASE}/campaigns/${campaignId}/start`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MILLIS_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        return new Response(
          JSON.stringify({ success: true, message: 'Campanha iniciada com sucesso' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'make-call':
        // Simular chamada individual
        const callData = {
          phone_number: requestData.phone_number,
          agent_id: requestData.agent_id,
          script: requestData.script
        }

        // Simular resposta da API MillisAI
        const callId = `call_${Date.now()}`
        const duration = Math.floor(Math.random() * 300) + 30 // 30-330 segundos
        const cost = (duration * 0.002).toFixed(4) // R$ 0.002 por segundo
        const status = ['completed', 'failed', 'busy', 'no_answer'][Math.floor(Math.random() * 4)]

        // Registrar chamada no banco
        const { data: callLog, error: callError } = await supabaseClient
          .from('call_logs')
          .insert({
            campaign_id: requestData.campaign_id,
            agent_id: requestData.agent_id,
            user_id: user.id,
            phone_number: requestData.phone_number,
            status: status,
            duration: status === 'completed' ? duration : Math.floor(duration / 10),
            cost: status === 'completed' ? parseFloat(cost) : 0.05,
            transcript: status === 'completed' ? 'Chamada realizada com sucesso. Cliente demonstrou interesse.' : 'Chamada não completada.',
            millis_call_id: callId,
            started_at: new Date().toISOString(),
            ended_at: new Date(Date.now() + duration * 1000).toISOString()
          })
          .select()
          .single()

        if (callError) throw callError

        return new Response(
          JSON.stringify({ success: true, call: callLog }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get-analytics':
        // Buscar estatísticas do usuário
        const { data: campaigns } = await supabaseClient
          .from('campaigns')
          .select('*')
          .eq('user_id', user.id)

        const { data: calls } = await supabaseClient
          .from('call_logs')
          .select('*')
          .eq('user_id', user.id)

        const { data: agents } = await supabaseClient
          .from('agents')
          .select('*')
          .eq('user_id', user.id)

        const analytics = {
          total_campaigns: campaigns?.length || 0,
          active_campaigns: campaigns?.filter(c => c.status === 'active').length || 0,
          total_calls: calls?.length || 0,
          successful_calls: calls?.filter(c => c.status === 'completed').length || 0,
          total_agents: agents?.length || 0,
          active_agents: agents?.filter(a => a.status === 'active').length || 0,
          total_cost: calls?.reduce((sum, call) => sum + (call.cost || 0), 0) || 0,
          avg_duration: calls?.length ? 
            calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length : 0
        }

        return new Response(
          JSON.stringify({ success: true, analytics }),
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