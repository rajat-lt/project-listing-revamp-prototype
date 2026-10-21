// Create Test Run, in a drawer on this page (Rajat, 21 Oct 2026: answer 9).
// PROVISIONAL: the screenshot of the product's drawer did not arrive, so the
// fields are the ones LambdaTest's docs list for creating a test run (Test Run
// - Creation and Management, read 21 Oct 2026, last updated Oct 15, 2026): a
// name, an optional description and tags, then Create Test Run. Spec C15 and
// question 11.
import React, { useId, useImperativeHandle, useRef, useState } from 'react'
import { LTButton, LTInputBox, LTTextarea, LTFormControl } from './lt.jsx'
import { LTDrawer, LTTextInputWithTokens } from './overlays.jsx'

export const CreateTestRunDrawer = React.forwardRef(function CreateTestRunDrawer({ project, onCreate }, ref) {
  const drawerRef = useRef(null)
  const nameRef = useRef(null)
  const formId = useId()
  const tagsId = useId()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const [error, setError] = useState(false)
  // A new key gives every opening a fresh token field.
  const [round, setRound] = useState(0)

  useImperativeHandle(ref, () => ({
    open: () => {
      setName(''); setDescription(''); setTags([]); setError(false); setRound(r => r + 1)
      drawerRef.current.openDrawer()
    },
  }))

  const submit = e => {
    e.preventDefault()
    const n = name.trim()
    if (!n) { setError(true); nameRef.current?.focus(); return }
    onCreate({ project, name: n, description: description.trim(), tags })
    drawerRef.current.closeDrawer()
  }

  return (
    <LTDrawer ref={drawerRef} title="Create Test Run" subTitle={project?.name} width={480}
      dirty={Boolean(name || description || tags.length)} initialFocusRef={nameRef}
      content={
        <form id={formId} className="form" noValidate onSubmit={submit}>
          <LTInputBox type="text" label="Test run name" required value={name} forwardRef={nameRef}
            placeholder="Regression Suite - Release 8.4"
            caption="A descriptive name helps you find it later."
            validationStatus={error ? 'error' : 'default'} validationMessage="Enter a test run name."
            onChange={v => { setName(v); if (error && v.trim()) setError(false) }} />
          <LTTextarea label="Description" rows={4} value={description} onChange={setDescription} />
          <LTFormControl label="Tags" id={tagsId} caption="Press Enter to add each tag.">
            <LTTextInputWithTokens key={round} id={tagsId} describedBy={`${tagsId}-cap`}
              onTokenAdd={t => setTags(l => [...l, t])} removeToken={t => setTags(l => l.filter(x => x !== t))} />
          </LTFormControl>
        </form>
      }
      footerContent={
        <>
          <LTButton variant="outline" size="medium" label="Cancel" onClick={() => drawerRef.current.closeDrawer()} />
          <LTButton variant="primary" size="medium" label="Create Test Run" btnType="submit" form={formId} />
        </>
      } />
  )
})
