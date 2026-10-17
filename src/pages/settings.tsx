import * as React from 'react'
import {
  Bell,
  Globe2,
  LockKeyhole,
  Radio,
  Router,
  Save,
  ShieldCheck,
  Wifi,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { InlineNotice } from '@/components/ui/inline-notice'
import { PageBody, PageHeader } from '@/components/console/page'
import { SettingsSection, SettingRow } from '@/components/console/settings-section'

type SettingsForm = {
  siteName: string
  timezone: string
  gateway: string
  dns: string
  autoUpdate: boolean
  channelWidth: string
  guestNetwork: boolean
  clientIsolation: boolean
  telemetry: boolean
  email: string
  criticalAlerts: boolean
  weeklyDigest: boolean
}

const initialForm: SettingsForm = {
  siteName: '北辰实验室',
  timezone: 'Asia/Shanghai',
  gateway: '192.168.10.1',
  dns: '1.1.1.1, 8.8.8.8',
  autoUpdate: true,
  channelWidth: '80',
  guestNetwork: true,
  clientIsolation: true,
  telemetry: false,
  email: 'ops@northstar.example',
  criticalAlerts: true,
  weeklyDigest: false,
}

const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SettingsPage() {
  const [form, setForm] = React.useState<SettingsForm>(initialForm)
  const [baseline, setBaseline] = React.useState<SettingsForm>(initialForm)
  const [submitted, setSubmitted] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [savedAt, setSavedAt] = React.useState('')
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  const errors: Partial<Record<keyof SettingsForm, string>> = {}
  if (form.siteName.trim().length < 2) errors.siteName = '站点名称至少需要 2 个字符。'
  if (!ipv4.test(form.gateway)) errors.gateway = '请输入有效的 IPv4 地址。'
  const dnsServers = form.dns.split(',').map((item) => item.trim()).filter(Boolean)
  if (!dnsServers.length || dnsServers.some((server) => !ipv4.test(server))) {
    errors.dns = '使用逗号分隔的 IPv4 地址，例如 1.1.1.1, 8.8.8.8。'
  }
  if (form.criticalAlerts && !emailPattern.test(form.email)) {
    errors.email = '启用告警邮件时，需要有效的邮箱地址。'
  }
  const errorCount = Object.keys(errors).length
  const changedCount = (Object.keys(form) as Array<keyof SettingsForm>).filter(
    (key) => form[key] !== baseline[key],
  ).length
  const showErrors = submitted && errorCount > 0

  const update = <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setSavedAt('')
  }

  const save = () => {
    setSubmitted(true)
    if (errorCount) return
    setSaving(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setSaving(false)
      setBaseline(form)
      setSubmitted(false)
      setSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
    }, 900)
  }

  const reset = () => {
    setForm(initialForm)
    setBaseline(initialForm)
    setSubmitted(false)
    setSavedAt('')
  }

  return (
    <PageBody className="pb-0">
      <PageHeader
        title="设置"
        description="演示站点的网络、无线、安全与通知配置。所有更改只保存在当前页面内存中。"
        meta={
          dirty ? (
            <Badge tone="warning" dot>
              未保存
            </Badge>
          ) : savedAt ? (
            <Badge tone="success" dot>
              已保存 {savedAt}
            </Badge>
          ) : (
            <Badge tone="neutral">系统默认</Badge>
          )
        }
        actions={
          <Button variant="ghost" onClick={reset} disabled={!dirty || saving}>
            恢复默认
          </Button>
        }
      />

      {showErrors ? (
        <InlineNotice tone="danger" title={'无法保存：还有 ' + errorCount + ' 个字段需要修正'} className="mb-3">
          请检查标红的输入框。表单不会在错误状态下提交。
        </InlineNotice>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <SettingsSection
            title="站点"
            description="显示名称、时区与控制器身份"
            icon={<Globe2 className="size-3.5" />}
          >
            <SettingRow label="站点名称" description="用于控制台标题和通知。">
              <Input
                value={form.siteName}
                onChange={(event) => update('siteName', event.target.value)}
                error={showErrors ? errors.siteName : undefined}
                aria-label="站点名称"
              />
            </SettingRow>
            <SettingRow label="时区" description="影响活动时间、备份和报表。">
              <Select value={form.timezone} onValueChange={(value) => update('timezone', value)}>
                <SelectTrigger aria-label="时区">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="控制器版本" description="只读。更新会在维护窗口执行。">
              <div className="flex items-center justify-between rounded-[var(--lat-radius-sm)] border border-line bg-raised px-2.5 py-1.5 text-[11px]">
                <span className="lat-data text-muted">4.8.2</span>
                <Badge tone="success" dot>
                  最新
                </Badge>
              </div>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            title="互联网"
            description="网关地址与 DNS 解析"
            icon={<Router className="size-3.5" />}
          >
            <SettingRow label="网关 IP 地址" description="局域网内控制器的默认网关。">
              <Input
                value={form.gateway}
                onChange={(event) => update('gateway', event.target.value)}
                error={showErrors ? errors.gateway : undefined}
                className="lat-data"
                aria-label="网关 IP 地址"
              />
            </SettingRow>
            <SettingRow label="DNS 服务器" description="按优先级排列，用逗号分隔。">
              <Input
                value={form.dns}
                onChange={(event) => update('dns', event.target.value)}
                error={showErrors ? errors.dns : undefined}
                className="lat-data"
                aria-label="DNS 服务器"
              />
            </SettingRow>
            <SettingRow label="自动更新" description="在凌晨低峰时段安装稳定版更新。">
              <Switch
                checked={form.autoUpdate}
                onCheckedChange={(checked) => update('autoUpdate', checked)}
                label="自动安装稳定版"
                description="维护窗口：每天 03:00–05:00"
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            title="无线"
            description="默认 SSID、信道宽度与访客隔离"
            icon={<Wifi className="size-3.5" />}
          >
            <SettingRow label="5 GHz 信道宽度" description="更宽的信道提高吞吐量，也增加干扰概率。">
              <Select value={form.channelWidth} onValueChange={(value) => update('channelWidth', value)}>
                <SelectTrigger aria-label="5 GHz 信道宽度">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 MHz</SelectItem>
                  <SelectItem value="40">40 MHz</SelectItem>
                  <SelectItem value="80">80 MHz</SelectItem>
                  <SelectItem value="160">160 MHz</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="访客网络" description="为访客提供独立 SSID，默认阻止访问内网。">
              <Switch
                checked={form.guestNetwork}
                onCheckedChange={(checked) => update('guestNetwork', checked)}
                label="启用访客网络"
              />
            </SettingRow>
            <SettingRow label="客户端隔离" description="阻止同一 SSID 下的客户端互相访问。">
              <Switch
                checked={form.clientIsolation}
                onCheckedChange={(checked) => update('clientIsolation', checked)}
                label="启用客户端隔离"
              />
            </SettingRow>
            <SettingRow label="实验信道" description="2.4 GHz 自动选择 1 / 6 / 11，减少重叠。">
              <div className="flex items-center gap-1.5">
                {['1', '6', '11'].map((channel) => (
                  <span
                    key={channel}
                    className={
                      'rounded-[var(--lat-radius-sm)] border border-line bg-raised px-2 py-1 text-[10px] ' +
                      (channel === '6' ? 'border-action/40 text-action' : 'text-faint')
                    }
                  >
                    CH {channel}
                  </span>
                ))}
              </div>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            title="安全与访问"
            description="管理证书、管理员访问和隐私"
            icon={<ShieldCheck className="size-3.5" />}
          >
            <SettingRow label="管理证书" description="证书将在 12 天后到期。">
              <div className="flex items-center justify-between rounded-[var(--lat-radius-sm)] border border-warning/25 bg-warning-soft px-2.5 py-1.5 text-[11px]">
                <span className="text-warning">需要更新</span>
                <Button variant="link" size="sm" className="h-auto text-[10px]">
                  查看
                </Button>
              </div>
            </SettingRow>
            <SettingRow label="匿名诊断" description="发送崩溃和性能摘要，不包含客户端流量。">
              <Switch
                checked={form.telemetry}
                onCheckedChange={(checked) => update('telemetry', checked)}
                label="发送匿名诊断数据"
              />
            </SettingRow>
            <SettingRow label="管理员会话" description="上次登录来自 192.168.10.8。">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-success">
                  <LockKeyhole className="size-3" />
                  受保护
                </span>
                <span className="lat-data text-faint">2 个活动会话</span>
              </div>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            title="通知"
            description="告警与每周摘要"
            icon={<Bell className="size-3.5" />}
          >
            <SettingRow label="告警邮箱" description="严重告警会立即发送到该地址。">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                error={showErrors ? errors.email : undefined}
                aria-label="告警邮箱"
              />
            </SettingRow>
            <SettingRow label="严重告警" description="设备离线、WAN 中断和安全事件。">
              <Switch
                checked={form.criticalAlerts}
                onCheckedChange={(checked) => update('criticalAlerts', checked)}
                label="发送严重告警"
              />
            </SettingRow>
            <SettingRow label="每周摘要" description="每周一 09:00 发送容量和健康摘要。">
              <Switch
                checked={form.weeklyDigest}
                onCheckedChange={(checked) => update('weeklyDigest', checked)}
                label="发送每周摘要"
              />
            </SettingRow>
          </SettingsSection>
        </div>

        <aside className="space-y-3">
          <div className="rounded-[var(--lat-radius-lg)] border border-line bg-surface p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-ink">
              <Radio className="size-3.5 text-action" />
              配置健康
            </div>
            <div className="mt-3 space-y-2.5 text-[10px]">
              <HealthRow label="站点身份" value="完整" tone="success" />
              <HealthRow label="DNS 解析" value="正常" tone="success" />
              <HealthRow label="证书" value="12 天后到期" tone="warning" />
              <HealthRow label="备份" value="今天 09:56" tone="success" />
            </div>
            <div className="mt-3 border-t border-line pt-2.5 text-[9px] leading-4 text-faint">
              设置表单包含必填校验、错误关联、未保存状态和保存反馈。更改不会写入真实控制器。
            </div>
          </div>
          <div className="rounded-[var(--lat-radius-lg)] border border-line bg-surface p-3.5">
            <div className="text-[11px] font-medium text-ink">表单状态</div>
            <div className="mt-2 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-faint">已修改字段</span>
                <span className="lat-data text-ink">{changedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-faint">校验错误</span>
                <span className={'lat-data ' + (errorCount ? 'text-danger' : 'text-ink')}>{errorCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-faint">保存状态</span>
                <span className={savedAt ? 'text-success' : 'text-faint'}>
                  {saving ? '保存中' : savedAt ? '已保存' : dirty ? '未保存' : '无更改'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 z-10 mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas py-3">
        <div className="text-[11px] text-muted" aria-live="polite">
          {saving
            ? '正在保存设置…'
            : savedAt
              ? '所有更改已保存 · ' + savedAt
              : dirty
                ? '有未保存的更改'
                : '所有更改已保存'}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={reset} disabled={!dirty || saving}>
            放弃
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!dirty || saving} loading={saving}>
            <Save className="size-3.5" />
            保存更改
          </Button>
        </div>
      </div>
    </PageBody>
  )
}

function HealthRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'success' | 'warning'
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-faint">{label}</span>
      <span className={tone === 'success' ? 'text-success' : 'text-warning'}>{value}</span>
    </div>
  )
}
