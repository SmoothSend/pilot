import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { CheckCircle2, Circle, ArrowLeft, LayoutList } from 'lucide-react'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: todos } = await supabase.from('todos').select('*').order('created_at', { ascending: false })

  return (
    <div className="page-bg min-h-screen overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob-primary" style={{ opacity: 0.5 }} />
      <div className="blob-secondary" style={{ opacity: 0.3 }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Navigation & Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/" className="btn-ghost px-0 mb-4 inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(117,149,255,0.1)',
                  border: '1px solid rgba(117,149,255,0.2)'
                }}
              >
                <LayoutList className="w-5 h-5" style={{ color: '#7595FF' }} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Todos
                </h1>
                <p className="text-xs mt-1 text-muted-foreground">
                  {todos?.length || 0} active tasks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-3">
          {!todos || todos.length === 0 ? (
            <div className="text-center py-20 card border-dashed">
              <p className="text-foreground-ghost">No todos found.</p>
            </div>
          ) : (
            todos.map((todo: any) => {
              const completed = todo.is_complete || false;
              return (
                <div
                  key={todo.id}
                  className="card-flat p-4 flex items-center gap-4 transition-all"
                  style={{
                    background: completed ? 'rgba(0,0,0,0.2)' : undefined,
                    opacity: completed ? 0.6 : 1,
                  }}
                >
                  <button className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-foreground-dim" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {todo.name || todo.title || 'Untitled Todo'}
                    </p>
                    {todo.created_at && (
                      <p className="text-xs mt-0.5 text-foreground-ghost">
                        {new Date(todo.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}
