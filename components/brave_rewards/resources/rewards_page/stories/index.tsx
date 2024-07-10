/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'

import {
  LocaleContext,
  createLocaleContextForTesting
} from '../../shared/lib/locale_context'

import { css, scopedCSS } from '../lib/scoped_css'
import { AppModelContext } from '../lib/app_model_context'
import { createModel } from './storybook_model'
import { localeStrings } from '../lib/locale_strings'
import { App } from '../components/app'

export default {
  title: 'Rewards/Page'
}

const style = scopedCSS('storybook-wrapper', css`
  & {
    position: absolute;
    inset: 0;
  }
`)

export function RewardsPage() {
  const model = React.useMemo(() => createModel(), [])
  const locale = React.useMemo(
    () => createLocaleContextForTesting(localeStrings), [])

  return (
    <LocaleContext.Provider value={locale}>
      <AppModelContext.Provider value={model}>
        <div {...style}>
          <App />
        </div>
      </AppModelContext.Provider>
    </LocaleContext.Provider>
  )
}
