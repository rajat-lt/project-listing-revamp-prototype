// Create Test Run, in a drawer on this page (Rajat, 21 Oct 2026: answer 9),
// as his screenshot of the product's drawer shows it (v3 item 6): a name, a
// description, tags, and the type, then Create Test Run. The strings follow
// ux-text-guidelines.md, each change from the screenshot recorded in the
// spec's copy table (§8b). Spec C15 and C19.
import React, { useId, useImperativeHandle, useRef, useState } from 'react'
import { LTButton, LTInputBox, LTTextarea, LTFormControl, LTRadioGroup } from './lt.jsx'
import { LTDrawer, LTTextInputWithTokens } from './overlays.jsx'

export const CreateTestRunDrawer = React.forwardRef(function CreateTestRunDrawer({ project, onCreate }, ref) {
  const drawerRef = useRef(null)
  const nameRef = useRef(null)
  const formId = useId()
  const tagsId = useId()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const [type, setType] = useState('non-kaneai')
  const [error, setError] = useState(false)
  // A new key gives every opening a fresh token field.
  const [round, setRound] = useState(0)

  useImperativeHandle(ref, () => ({
    open: () => {
      setName(''); setDescription(''); setTags([]); setType('non-kaneai'); setError(false); setRound(r => r + 1)
      drawerRef.current.openDrawer()
    },
  }))

  const submit = e => {
    e.preventDefault()
    const n = name.trim()
    if (!n) { setError(true); nameRef.current?.focus(); return }
    onCreate({ project, name: n, description: description.trim(), tags, type })
    drawerRef.current.closeDrawer()
  }

  return (
    <LTDrawer ref={drawerRef} title="Create Test Run" subTitle={project?.name} width={480}
      dirty={Boolean(name || description || tags.length)} initialFocusRef={nameRef}
      content={
        <form id={formId} className="form form--drawer" noValidate onSubmit={submit}>
          <LTInputBox type="text" variant="white" label="Test run name" required value={name} forwardRef={nameRef}
            placeholder="Enter a test run name" caption="The unique name for your test run."
            validationStatus={error ? 'error' : 'default'} validationMessage="Enter a test run name."
            onChange={v => { setName(v); if (error && v.trim()) setError(false) }} />
          <LTTextarea label="Description" rows={6} value={description} onChange={setDescription}
            placeholder="Add a description to the test run" caption="A brief overview of the test run's purpose." />
          <LTFormControl label="Tags" id={tagsId} caption="Keywords to help categorize and filter the test run.">
            <LTTextInputWithTokens key={round} id={tagsId} describedBy={`${tagsId}-cap`} placeholder="Add tags separated by Enter"
              onTokenAdd={t => setTags(l => [...l, t])} removeToken={t => setTags(l => l.filter(x => x !== t))} />
          </LTFormControl>
          {/* The product's two types, in its words, sentence case (C19). The
              most likely one is pre-checked (guidelines/ltradiogroup.md). */}
          <LTRadioGroup key={`type-${round}`} label="Type" required ariaRequired groupName={`${formId}-type`}
            defaultCheckedValue="non-kaneai" onChange={setType}
            caption="Define the source of test cases for this test run."
            options={[{ value: 'non-kaneai', label: 'Non KaneAI generated' }, { value: 'kaneai', label: 'KaneAI generated' }]} />
          {/* The legend for the asterisks (ltradiogroup.md prefers words to an
              asterisk alone). */}
          <p className="form__note">Required fields are marked with an asterisk (*).</p>
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
