import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers, NavigationService } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';

import { AuthProvider } from '@apollosproject/ui-auth';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import NotificationsProvider from './NotificationsProvider';
import { LiveProvider } from './live/LiveContext';

import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';
import { track, identify } from './amplitude';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsProvider
      oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
      navigate={NavigationService.navigate}
    >
      <AuthProvider
        navigateToAuth={() => NavigationService.navigate('Auth')}
        navigate={NavigationService.navigate}
        closeAuth={() =>
          checkOnboardingStatusAndNavigate({
            client,
            navigation: NavigationService,
          })
        }
      >
        <MediaPlayerProvider>
          <AnalyticsProvider
            trackFunctions={[track]}
            identifyFunctions={[identify]}
            useServerAnalytics={false}
          >
            <LiveProvider>
              <Providers
                themeInput={customTheme}
                iconInput={customIcons}
                {...props}
              />
            </LiveProvider>
          </AnalyticsProvider>
        </MediaPlayerProvider>
      </AuthProvider>
    </NotificationsProvider>
  </ClientProvider>
);

export default AppProviders;
