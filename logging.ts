import { App } from 'vue'

export type ViewModel = {
  _isVue?: boolean,
  __isVue?: boolean,
  $root: ViewModel,
  $parent?: ViewModel,
  $props: { [key: string]: any }, // eslint-disable-line @typescript-eslint/no-explicit-any
  $options?: {
    name?: string,
    propsData?: { [key: string]: any }, // eslint-disable-line @typescript-eslint/no-explicit-any
    _componentTag?: string,
    __file?: string,
  }
}

// type VueApp = {
//   config: {
//     errorHandler: (error: Error, vm: ViewModel, lifecycleHook: string) => void
//   },
// }

type Metadata = {
  browser: string;
  version: string;
  os: string;
}

type Message = {
  name: string;
  message: string;
  meta: string;
}

function getUserDataInfo (): Metadata {
  const userAgt = navigator.userAgent
  let vOffset: number
  let nOffset: number
  let browser = 'unknown'
  let version = 'unknown'
  let index: number

  if ((vOffset = userAgt.indexOf('OPR')) !== -1) { // Opera Next
    browser = 'Opera'
    version = userAgt.substring(vOffset + 4)
  } else if ((vOffset = userAgt.indexOf('Opera')) !== -1) { // Opera
    browser = 'Opera'
    version = userAgt.substring(vOffset + 6)
    if ((vOffset = userAgt.indexOf('Version')) !== -1) {
      version = userAgt.substring(vOffset + 8)
    }
  } else if ((vOffset = userAgt.indexOf('Edge')) !== -1) { // Legacy Edge
    browser = 'Microsoft Legacy Edge'
    version = userAgt.substring(vOffset + 5)
  } else if ((vOffset = userAgt.indexOf('Edg')) !== -1) { // Edge (Chromium)
    browser = 'Microsoft Edge'
    version = userAgt.substring(vOffset + 4)
  } else if ((vOffset = userAgt.indexOf('MSIE')) !== -1) { // MSIE
    browser = 'Microsoft Internet Explorer'
    version = userAgt.substring(vOffset + 5)
  } else if ((vOffset = userAgt.indexOf('Chrome')) !== -1) { // Chrome
    browser = 'Chrome'
    version = userAgt.substring(vOffset + 7)
  } else if ((vOffset = userAgt.indexOf('Safari')) !== -1) { // Safari
    browser = 'Safari'
    version = userAgt.substring(vOffset + 7)
    if ((vOffset = userAgt.indexOf('Version')) !== -1) {
      version = userAgt.substring(vOffset + 8)
    }
  } else if ((vOffset = userAgt.indexOf('Firefox')) !== -1) { // Firefox
    browser = 'Firefox'
    version = userAgt.substring(vOffset + 8)
  } else if (userAgt.indexOf('Trident/') !== -1) { // MSIE 11+
    browser = 'Microsoft Internet Explorer'
    version = userAgt.substring(userAgt.indexOf('rv:') + 3)
  } else if ((nOffset = userAgt.lastIndexOf(' ') + 1) < (vOffset = userAgt.lastIndexOf('/'))) { // Other browsers
    browser = userAgt.substring(nOffset, vOffset)
    version = userAgt.substring(vOffset + 1)
  }
  if ((index = version.indexOf(';')) !== -1) version = version.substring(0, index)
  if ((index = version.indexOf(' ')) !== -1) version = version.substring(0, index)
  if ((index = version.indexOf(')')) !== -1) version = version.substring(0, index)

  let os = 'unknown'
  const clientStrings = [
    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Chrome OS', r: /CrOS/ },
    { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
  ]
  for (const id in clientStrings) {
    const cs = clientStrings[id]
    if (cs.r.test(userAgt)) {
      os = cs.s
      break
    }
  }

  const md: Metadata = {
    browser,
    version,
    os
  }
  return md
}

export function sendMessage (message :Message) {
  fetch('https://logging.dance-event.online/api/f8786cf7-05a2-4e60-8778-e475f58ea3b2/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .catch((error) => {
      console.log(error)
    })
}

export function init (app: App) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.config.errorHandler = (error, vm, lifecycleHook): void => {
    const message: Message = {
      name: 'unknown',
      message: '',
      meta: JSON.stringify(getUserDataInfo())
    }
    if (error instanceof Error) {
      message.name = error.name
      message.message = error.stack || ''
    }
    sendMessage(message)
  }
}
