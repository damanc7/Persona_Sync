import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, X, Zap, Link2, ExternalLink } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAgentConnections, useToggleAgentConnection, type AgentConnection } from '@/hooks/useAgentConnections'

const MCP_URL = 'http://localhost:8000/mcp'

const CONNECTION_INSTRUCTIONS: Record<string, { label: string; config: string }> = {
  claude: {
    label: '~/.claude/settings.json',
    config: JSON.stringify(
      { mcpServers: { 'data-daddy': { type: 'http', url: MCP_URL } } },
      null, 2
    ),
  },
  cursor: {
    label: '.cursor/mcp.json',
    config: JSON.stringify(
      { mcpServers: { 'data-daddy': { url: MCP_URL, transport: 'streamable-http' } } },
      null, 2
    ),
  },
  perplexity: {
    label: 'Perplexity Desktop → Settings → MCP Servers',
    config: JSON.stringify({ name: 'data-daddy', url: MCP_URL, transport: 'streamable-http' }, null, 2),
  },
  chatgpt: {
    label: 'ChatGPT → Connectors (coming soon)',
    config: `# OpenAI MCP support is rolling out.\n# Use the URL below when available:\n\n${MCP_URL}`,
  },
  gemini: {
    label: 'Gemini → Extensions (coming soon)',
    config: `# Google Gemini MCP support is in preview.\n# Use the URL below when available:\n\n${MCP_URL}`,
  },
}

const AGENT_COLORS: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  amber:   { bg: 'bg-amber-500/15',   text: 'text-amber-400',   ring: 'ring-amber-500/30',   dot: 'bg-amber-400' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/30', dot: 'bg-emerald-400' },
  blue:    { bg: 'bg-blue-500/15',    text: 'text-blue-400',    ring: 'ring-blue-500/30',    dot: 'bg-blue-400' },
  cyan:    { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    ring: 'ring-cyan-500/30',    dot: 'bg-cyan-400' },
  violet:  { bg: 'bg-violet-500/15',  text: 'text-violet-400',  ring: 'ring-violet-500/30',  dot: 'bg-violet-400' },
  rose:    { bg: 'bg-rose-500/15',    text: 'text-rose-400',    ring: 'ring-rose-500/30',    dot: 'bg-rose-400' },
}

const AGENT_INITIALS: Record<string, string> = {
  claude: 'Cl', chatgpt: 'GP', gemini: 'Ge', perplexity: 'Px', cursor: 'Cu',
}

function AgentCard({
  agent,
  onConnect,
  onDisconnect,
}: {
  agent: AgentConnection
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
}) {
  const colors = AGENT_COLORS[agent.color] ?? AGENT_COLORS.violet

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        variant={agent.connected ? 'elevated' : 'default'}
        className={`p-5 flex flex-col gap-4 transition-all duration-300 ${agent.connected ? `ring-1 ${colors.ring}` : ''}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold font-mono shrink-0 ${colors.bg} ${colors.text}`}>
              {AGENT_INITIALS[agent.id] ?? agent.name.slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{agent.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{agent.provider}</p>
            </div>
          </div>

          {/* Status dot + badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {agent.connected && (
              <span className={`h-2 w-2 rounded-full ${colors.dot} animate-pulse`} />
            )}
            <Badge variant={agent.connected ? 'success' : 'muted'}>
              {agent.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          {agent.description}
        </p>

        {/* Connected meta */}
        {agent.connected && (agent.lastConnected || agent.toolsUsed !== undefined) && (
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            {agent.toolsUsed !== undefined && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {agent.toolsUsed} tool{agent.toolsUsed !== 1 ? 's' : ''} used
              </span>
            )}
            {agent.lastConnected && (
              <span className="flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                {new Date(agent.lastConnected).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className="mt-auto pt-1">
          {agent.connected ? (
            <Button
              variant="danger"
              size="sm"
              className="w-full"
              onClick={() => onDisconnect(agent.id)}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onConnect(agent.id)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Connect
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

function ConnectModal({
  agent,
  onClose,
}: {
  agent: AgentConnection
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const instructions = CONNECTION_INSTRUCTIONS[agent.id]

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions?.config ?? MCP_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card variant="elevated" className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Connect {agent.name}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Add DataDaddy to {agent.name}'s MCP configuration
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* MCP URL */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">MCP Server URL</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-subtle)] font-mono text-xs text-[var(--color-text-primary)]">
              <span className="flex-1 truncate">{MCP_URL}</span>
            </div>
          </div>

          {/* Config snippet */}
          {instructions && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                {instructions.label}
              </p>
              <div className="relative">
                <pre className="text-xs rounded-lg bg-black/40 border border-[var(--color-border-subtle)] p-4 overflow-x-auto text-emerald-300 leading-relaxed">
                  {instructions.config}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-[var(--color-text-secondary)] transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-muted)]">
            After saving the config, restart {agent.name} to pick up the new MCP server. The connection status will update automatically.
          </p>

          <Button variant="primary" size="sm" className="w-full" onClick={onClose}>
            Done
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}

function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy URL'}
    </Button>
  )
}

export function AgentConnections() {
  const { data, isLoading } = useAgentConnections()
  const toggle = useToggleAgentConnection()
  const [connectingAgent, setConnectingAgent] = useState<AgentConnection | null>(null)

  const mcpUrl = data?.mcpUrl ?? MCP_URL
  const agents = data?.agents ?? []
  const connectedCount = agents.filter(a => a.connected).length

  const handleConnect = (id: string) => {
    const agent = agents.find(a => a.id === id)
    if (agent) setConnectingAgent(agent)
  }

  const handleDisconnect = (id: string) => {
    toggle.mutate(id)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Agent Connections"
        actions={<CopyUrlButton url={mcpUrl} />}
      />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* MCP server banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20"
        >
          <div className="flex-1">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-0.5">Your MCP Server</p>
            <p className="text-sm font-mono text-violet-300">{mcpUrl}</p>
          </div>
          <Badge variant="violet">
            {isLoading ? '…' : connectedCount} connected
          </Badge>
        </motion.div>

        {/* Section label */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            AI Agents
          </p>
          {!isLoading && (
            <p className="text-xs text-[var(--color-text-muted)]">
              {connectedCount} of {agents.length} connected
            </p>
          )}
        </div>

        {/* Agent grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Connect modal */}
      <AnimatePresence>
        {connectingAgent && (
          <ConnectModal
            agent={connectingAgent}
            onClose={() => setConnectingAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
