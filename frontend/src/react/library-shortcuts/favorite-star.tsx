/* 收藏星标：名册格与身份格的同一条入口。
 *
 * 两处都长在可点区域旁边而不是里面——整卡与整个身份格已经是按钮，星标必须是兄弟
 * 节点，键盘 Tab 才到得了，点它也不会顺带打开卡片。选中态、回执与失败退回都交给
 * `useFavoriteToggle`；失败回执和其余写失败一样进右下角通知栈。 */
import { useRef, type ComponentProps } from 'react';
import { esc } from '@peach/legacy/core';
import { spinnerHtml } from '@peach/legacy/ui';
import { errorMessage } from '../../api';
import { entityDisplayName } from '../../core/entity-names';
import { t } from '../../i18n';
import { spriteGlyph } from '../components/sprite-glyph';
import { busyProps } from '../settings/busy-props';
import { showToast } from '../toaster';
import { useEntityNames } from '../use-entity-names';
import { useFavoriteToggle, type Favorite } from './library-shortcuts';
import './shortcuts.css';

const Star = spriteGlyph('star');

/** 实体行内的图标动作，共用收藏按钮的尺寸、悬停与焦点反馈。 */
export function EntityActionButton({ label, children, ...props }: ComponentProps<'button'> & { label: string }) {
  return <button type="button" {...props} data-entity-action="" aria-label={label} title={props.title || label}>{children}</button>;
}

/** 名册/身份格上的收藏键：选中翻色、等待时转圈，失败只进通知栈，不挤动格线。 */
export function FavoriteStar({ item, load, ...props }: { item: Favorite; load?: boolean } & ComponentProps<'button'>) {
  useEntityNames();
  const failed = useRef<unknown>(null);
  const favorite = useFavoriteToggle(item, {
    load,
    onError: (error) => {
      if (failed.current === error) return;
      failed.current = error;
      showToast(`favorite-${item.scope || 'local'}-${item.entity_id ?? item.tag_id ?? item.name}`, {
        html: esc(errorMessage(error)), alert: true, timeout: 6000, action: null,
      });
    },
  });
  const label = t(favorite.selected ? 'settings:favoritesPanel.unfavoriteLabel' : 'settings:favoritesPanel.favoriteLabel', {
    name: entityDisplayName(item.kind, item.name, item.entity_id),
  });
  return <EntityActionButton data-favorite="" aria-pressed={!!favorite.selected} label={label}
    {...props} {...busyProps(favorite.busy)} onClick={favorite.toggle}>
    {favorite.busy ? <span aria-hidden dangerouslySetInnerHTML={{ __html: spinnerHtml('') }} /> : <Star />}
  </EntityActionButton>;
}
