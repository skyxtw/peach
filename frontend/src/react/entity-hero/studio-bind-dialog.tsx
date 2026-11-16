/* 片商/厂牌页的「绑定 DMM 编号」弹层：只写绑定，不建订阅源；成功后由壳重取资料让
 *  feed.following 出现。弹层沿用 ModalFrame 与表单字段，不另造一套浮层。 */
import { useState } from 'react';
import { Heading } from 'react-aria-components';

import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { errorMessage } from '../../api';
import { t } from '../../i18n';
import { ModalFrame } from '../components/modal-frame';
import { Note } from '../components/note';
import { SettingsDialogClose } from '../components/settings-dialog-close';

export type DmmStudioKind = 'maker' | 'label';

export interface DmmStudioBinding {
  kind: DmmStudioKind;
  id: string;
}

const ID = /^[0-9]{1,10}$/;

/** 绑定一个 DMM maker/label 编号。`current` 只用于显示与预填，不提供删除。 */
export function StudioBindDialog({ current, close, bind }: {
  current: DmmStudioBinding[];
  close(): void;
  bind(kind: DmmStudioKind, id: string): Promise<void>;
}) {
  const first = current[0];
  const [kind, setKind] = useState<DmmStudioKind>(first?.kind || 'maker');
  const [value, setValue] = useState(first?.id || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const currentText = current.map((one) => t(one.kind === 'maker' ? 'catalog:studioBind.maker' : 'catalog:studioBind.label') + ' ' + one.id).join(' · ');
  const save = async () => {
    const id = value.trim();
    if (!ID.test(id)) {
      setError(t('catalog:studioBind.idDigits'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await bind(kind, id);
      close();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };
  return (
    <ModalFrame isOpen onOpenChange={open => { if (!open && !busy) close() }} width="form" label={t('catalog:studioBind.title')}>
      <form className="peach-react flex flex-col" data-studio-bind-dialog=""
        onSubmit={(event) => { event.preventDefault(); if (!busy) void save() }}>
        <div className="flex items-start justify-between gap-4 border-b border-separator-border p-5">
          <div className="min-w-0">
            <Heading slot="title" className="text-title-2-medium">{t('catalog:studioBind.title')}</Heading>
            {current.length ? (
              <p data-studio-bind-current="" className="mt-1 text-body-2-regular text-text-secondary wrap-anywhere">
                {t('catalog:studioBind.current', { ids: currentText })}
              </p>
            ) : null}
          </div>
          <SettingsDialogClose label={t('catalog:shared.close')} onPress={() => { if (!busy) close() }} />
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <span className="text-body-medium text-text-primary">{t('catalog:studioBind.dimension')}</span>
            <Select aria-label={t('catalog:studioBind.dimension')} selectedKey={kind} isDisabled={busy}
              onSelectionChange={key => { setKind(String(key) as DmmStudioKind); setError('') }}>
              <SelectItem id="maker">{t('catalog:studioBind.maker')}</SelectItem>
              <SelectItem id="label">{t('catalog:studioBind.label')}</SelectItem>
            </Select>
          </div>
          <Input label={t('catalog:studioBind.id')} value={value} onChange={next => { setValue(next); setError('') }}
            placeholder={t('catalog:studioBind.idPlaceholder')} hint={t('catalog:studioBind.idHint')}
            maxLength={10} isDisabled={busy} isRequired />
          {error ? <Note tone="error">{error}</Note> : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-separator-border p-4">
          <Button variant="secondary" onClick={() => { if (!busy) close() }}>{t('catalog:shared.cancel')}</Button>
          <Button variant="primary" type="submit" disabled={busy} aria-busy={busy || undefined}>
            {busy ? t('catalog:studioBind.submitting') : t('catalog:studioBind.submit')}
          </Button>
        </div>
      </form>
    </ModalFrame>
  );
}
