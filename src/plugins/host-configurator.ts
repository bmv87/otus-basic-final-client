import { IHostConfig, config } from '@/plugins/configs/hosts'

class HostConfig {
  h: IHostConfig

  constructor (h: IHostConfig) {
    this.h = h
  }

  public getServer (): string {
    return this.h.server
  }

  public getCurrent (): string {
    return this.h.current
  }
}

const hosts = (): HostConfig => {
  return new HostConfig(config())
}

export { hosts }
