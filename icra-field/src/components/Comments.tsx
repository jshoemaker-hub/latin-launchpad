import { useState } from 'react'
import { useProject } from '../state/project'
import { RoleTag, fmtDateTime } from './ui'

export default function Comments({ permitId, checklistId }: { permitId?: string; checklistId?: string }) {
  const { state, me, dispatch } = useProject()
  const [text, setText] = useState('')
  const comments = state.comments.filter((c) => (checklistId ? c.checklistId === checklistId : c.permitId === permitId && !c.checklistId))
  return (
    <section>
      <h2>Comments</h2>
      <ul className="list compact">
        {comments.map((c) => (
          <li key={c.id} className="comment">
            <div className="small">
              <strong>{c.actor.name}</strong> <RoleTag role={c.actor.role} /> <span className="muted">{fmtDateTime(c.at)}</span>
            </div>
            {c.itemId && <div className="small muted">On: {state.checklists[c.checklistId!]?.items.find((i) => i.id === c.itemId)?.text}</div>}
            <p>{c.text}</p>
          </li>
        ))}
      </ul>
      {me && (
        <form
          className="row"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!text.trim()) return
            await dispatch('comment.added', { permitId, checklistId, text: text.trim() })
            setText('')
          }}
        >
          <input className="grow" placeholder="Add a comment for the team" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn-secondary">Post</button>
        </form>
      )}
    </section>
  )
}
