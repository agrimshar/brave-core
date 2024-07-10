/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import ProgressRing from '@brave/leo/react/progressRing'

import { AppModelContext, useAppState } from '../lib/app_model_context'
import { EventHubContext } from '../lib/event_hub'
import { useRoute } from '../lib/router'
import { useBreakpoint } from '../lib/breakpoint'
import { AppErrorBoundary } from './app_error_boundary'
import { AppFrame } from './app_frame'
import { Onboarding } from './onboarding/onboarding'
import { OnboardingSuccessModal } from './onboarding/onboarding_success_modal'
import { ResetModal } from './reset_modal'

import { style } from './app.style'

export function App() {
  const model = React.useContext(AppModelContext)
  const eventHub = React.useContext(EventHubContext)

  const [loading, openTime, embedder, paymentId] = useAppState((state) => [
    state.loading,
    state.openTime,
    state.embedder,
    state.paymentId
  ])

  const viewType = useBreakpoint()

  React.useEffect(() => { model.onAppRendered() }, [model, openTime])

  const [showResetModal, setShowResetModal] = React.useState(false)
  const [showOnboardingSuccess, setShowOnboardingSuccess]
    = React.useState(false)

  useRoute((route, router) => {
    if (route === '/reset') {
      setShowResetModal(true)
      router.replaceRoute('/')
    }
  })

  React.useEffect(() => {
    return eventHub.addListener('open-modal', (data) => {
      if (data === 'reset') {
        setShowResetModal(true)
      }
    })
  }, [eventHub])

  function getComponentKey() {
    // This component key is used to reset the internal view state of the
    // component tree when the app is "reopened".
    return `rewards-page-${openTime}`
  }

  function getClassNames() {
    const list: string[] = []
    if (embedder.isBubble) {
      list.push('is-bubble')
    }
    if (viewType === 'narrow') {
      list.push('is-narrow-view')
    }
    if (embedder.animatedBackgroundEnabled) {
      list.push('animated-background')
    }
    return list.join(' ')
  }

  function renderModal() {
    if (showOnboardingSuccess) {
      const onClose = () => setShowOnboardingSuccess(false)
      return <OnboardingSuccessModal onClose={onClose} />
    }

    if (showResetModal) {
      const onReset = () => {
        model.resetRewards()
        setShowResetModal(false)
      }
      const onClose = () => {
        setShowResetModal(false)
      }
      return <ResetModal onReset={onReset} onClose={onClose} />
    }

    return null
  }

  function renderContent() {
    if (loading) {
      return (
        <div className='loading'>
          <ProgressRing />
        </div>
      )
    }

    if (!paymentId) {
      const showOnboardingCompleted = () => setShowOnboardingSuccess(true)
      return <Onboarding onOnboardingCompleted={showOnboardingCompleted} />
    }

    return (
      <>
        <AppFrame />
        {renderModal()}
      </>
    )
  }

  return (
    <div key={getComponentKey()} className={getClassNames()} {...style}>
      <AppErrorBoundary>
        {renderContent()}
      </AppErrorBoundary>
      <div className='background'>
        {viewType === 'narrow' && <div className='panel-background' />}
      </div>
    </div>
  )
}
