// Helper function to parse user-agent string
export const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase()
    
    // Detect browser - check more specific browsers first
    let browser = 'Unknown'
    if (ua.includes('edg')) browser = 'Edge'
    else if (ua.includes('opera')) browser = 'Opera'
    else if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari'
    else if (ua.includes('chrome')) browser = 'Chrome'
    else if (ua.includes('ie')) browser = 'Internet Explorer'
    
    // Detect OS
    let os = 'Unknown'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('mac')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('ios')) os = 'iOS'
    
    // Detect device type
    let device = 'Desktop'
    if (ua.includes('mobile')) device = 'Mobile'
    else if (ua.includes('tablet')) device = 'Tablet'
    else if (ua.includes('android') || ua.includes('ios')) device = 'Mobile'
    
    return { browser, os, device }
}

