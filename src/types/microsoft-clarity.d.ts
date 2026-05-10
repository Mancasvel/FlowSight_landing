declare module '@microsoft/clarity' {
  type ClarityStorageConsent = 'granted' | 'denied'

  type ClarityConsentV2Options = {
    ad_Storage?: ClarityStorageConsent
    analytics_Storage?: ClarityStorageConsent
  }

  const Clarity: {
    init(projectId: string): void
    setTag(key: string, value: string | string[]): void
    identify(customerId: string, customSessionId?: string, customPageId?: string, friendlyName?: string): void
    consent(consent?: boolean): void
    consentV2(consentOptions?: ClarityConsentV2Options): void
    upgrade(reason: string): void
    event(eventName: string): void
  }

  export default Clarity
}
