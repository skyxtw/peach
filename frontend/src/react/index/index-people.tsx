/* 名册网格：艺人、创作者、厂牌、事务所、系列名册和在线来源创作者。
 *
 * 一格人：圆框或竖幅头像、名字、一个读数。四种实体同一副版式、同一条取图链，区别只在
 * 格宽与读数口径。圆框里那段 HTML 由 `card-art` 的 `avatarInner` 拼（有图走图、没图退首字母、
 * 小图按原尺寸摆再糊一圈底），页面不重画一遍；原尺寸取图与补底规则在
 * `web/css/01-base.css` 的 `[data-person-ring]`，量图的是 `installCardArt` 挂在文档上的 `load` 监听。
 * 格底、头像框、首字与读数的配色在同目录的 `index-people.css`。 */
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Chip } from '@/components/base/badges/chip';
import { entityDisplayName } from '../../core/entity-names';
import { useEntityNames } from '../use-entity-names';

import { cardClass } from '../components/card';
import { FavoriteStar } from '../library-shortcuts/favorite-star';
import { IndexFollowButton, type FeedState } from './index-follow';
import { spriteGlyph } from '../components/sprite-glyph';
import type { OnlineAuthor } from '../follow/online-vocab';
import { ENTITY_KINDS, isCompany, personReadout, type IndexKind, type IndexPerson, type IndexProps, type PeopleLayout } from './index-data';
import type { RosterPicks } from './roster-selection';
import { serverLabels } from '../../core/server-text';
import { t } from '../../i18n';

/* 平移挂在圆框上而不是 img 上：竖幅裁到 3:4 时几何居中会切掉脸，而 img 由遗留层拼，
   只能从容器这一侧改。放大反过来只能挂在 img 上，所以脸框由 `avatarInner` 贴到 img 上。
   放大是把 img 撑得比框还宽再负偏移，Preflight 给 img 的 `max-width:100%` 会把它压回框宽，
   脸就被挤到一边，所以这里撤掉那一条；原尺寸摆的小图另由 `[data-native-small]` 收住。 */
function Ring({ html, face, company, big }: { html: string; face?: string; company: boolean; big: boolean }) {
  const ring = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (face) ring.current?.style.setProperty('--face', face);
    else ring.current?.style.removeProperty('--face');
  }, [face]);
  const shape = !big ? 'size-17.5 rounded-full' : company ? 'aspect-square w-full rounded-2lg' : 'aspect-3/4 w-full rounded-2lg';
  return (
    <span ref={ring} data-person-ring="" data-fit-native={company ? 'mark' : 'portrait'}
      className={`relative inline-grid flex-none place-items-center self-center overflow-hidden text-title-1-regular ${shape} [&_img]:absolute [&_img]:inset-0 [&_img]:block [&_img]:size-full [&_img]:max-w-none [&_img]:object-cover [&_img]:object-(--face)`}
      dangerouslySetInnerHTML={{ __html: html }} />
  );
}

const CELL = 'relative flex cursor-pointer flex-col gap-2 p-3 text-inherit';
const Rss = spriteGlyph('rss');

/* 多选模式下 `selected` 有值：点一格切换选中，勾的形状与作品卡同一副（`media-card.css` 的 `[data-media-check]`）。 */
function Cell(
  { name, readout, big, children, following, selected, actions, favorite, entityId, entityKind, feed, onPress, ...data }:
  {
    name: string; readout: string; big: boolean; children: ReactNode; following?: boolean;
    selected?: boolean; actions?: boolean; favorite?: boolean; entityId?: number; entityKind?: string;
    feed?: FeedState | null; onPress(): void;
  } & Record<`data-${string}`, string>,
) {
  const star = actions && entityKind === 'performer' && typeof entityId === 'number';
  const follow = actions && entityKind === 'performer' && typeof entityId === 'number' && feed
    ? { entityId, feed } : null;
  return (
    <div data-index-cell-slot="">
      <button type="button" {...data} data-index-cell="" onClick={onPress}
        aria-pressed={selected} data-selected={selected ? '' : undefined}
        className={cardClass({
          radius: 'plain', padding: 'none', interactive: true,
          className: `${CELL} ${big ? 'items-stretch text-left' : 'items-center text-center'}`,
        })}>
        {children}
        {selected === undefined ? null : <span data-media-check="" aria-hidden><svg viewBox="0 0 24 24"><use href="#i-check" /></svg></span>}
        {following && !follow ? <span data-index-feed="" role="img" aria-label={t('catalog:entityHero.newReleasesOn')}
          className={`index-feed-mark absolute top-4 z-2 inline-flex ${star ? 'left-4' : 'right-4'}`}>
          <Chip variant="caption" color="soft"><Rss /></Chip>
        </span> : null}
        <span data-index-name="" className="text-body-medium wrap-anywhere text-text-primary">{name}</span>
        <span data-index-readout="" className="text-caption-1-regular">{readout}</span>
      </button>
      {follow ? <IndexFollowButton item={{ entity_id: follow.entityId, name, feed: follow.feed }} /> : null}
      {star ? <FavoriteStar data-index-favorite="" item={{ entity_id: entityId, kind: entityKind, name, favorite }} /> : null}
    </div>
  );
}

/** 本地名册。资料页的名册（事务所旗下艺人、片商旗下厂牌）摆的也是这一格，只借取图与去处两样。 */
export function PeopleGrid(
  { kind, items, layout, props, actions = false, sort = 'n', kana = '', picks }:
  {
    kind: Exclude<IndexKind, 'tags'>; items: IndexPerson[]; layout: PeopleLayout;
    props: Pick<IndexProps, 'personAvatar' | 'openEntity'>;
    /** 当前排序列：格子的读数把它摆在最前面；别的名册不看。 */
    sort?: string;
    /** 当前五十音行：读数带上读音或「读音未取得」；别的名册不看。 */
    kana?: string;
    /** 资料页的名册没有随行下发收藏与订阅状态，只在索引页摆这两个实体动作。 */
    actions?: boolean;
    /** 多选模式下才有：点一格切换选中，不进资料页。 */
    picks?: RosterPicks;
  },
) {
  const company = isCompany(kind) || kind === 'series';
  useEntityNames();
  const big = layout === 'big';
  return (
    <div data-index-grid="" data-layout={layout} data-cells={company ? 'company' : 'people'}
      data-select-mode={picks ? '' : undefined}
      className={`${company ? 'index-grid-company' : 'index-grid-person'} gap-3`}>
      {items.map((item) => {
        const entityKind = item.entity_kind || ENTITY_KINDS[kind];
        const avatar = props.personAvatar(item, entityKind, big);
        /* 读数一行：作品数、身份分类，编辑资料里新建的档案（ADR-0165）再接一个「自建」。 */
        const readout = [
          personReadout(kind, item, sort, kana),
          ...(item.identity_labels?.length ? [serverLabels('identity.category', item.identity_categories, item.identity_labels).join(' / ')] : []),
          ...(item.user_created ? [t('catalog:itemEdit.userCreated')] : []),
        ].join(' · ');
        return (
          <Cell key={`${entityKind}:${item.entity_id || item.k}`} data-k={item.k} data-kind={entityKind} name={entityDisplayName(entityKind, item.k, item.entity_id)} readout={readout}
            {...(item.user_created ? { 'data-user-created': '' } : {})}
            big={big} following={item.following} selected={picks ? picks.picked.has(item.entity_id ?? item.id ?? 0) : undefined}
            actions={actions} favorite={item.favorite} entityId={item.entity_id}
            entityKind={entityKind} feed={item.feed}
            onPress={() => picks ? picks.toggle(item.entity_id ?? item.id ?? 0) : props.openEntity(entityKind, item.k)}>
            <Ring html={avatar.html} face={avatar.face} company={company} big={big} />
          </Cell>
        );
      })}
    </div>
  );
}

/** 在线那一档：关注来源里的创作者。建过档的点开去他的创作者资料页；还没建档的名下那批东西
 *  全在关注页上，点开等于「关注 · 这个人」；数据库里有同名创作者、等用户认的，读数带「待确认」，
 *  点开去那位的资料页，认人的按钮在那里。`data-follow-author` 挂的是关注页那套创作者键。 */
export function OnlineAuthors(
  { items, layout, props }: { items: OnlineAuthor[]; layout: PeopleLayout; props: IndexProps },
) {
  useEntityNames();
  const big = layout === 'big';
  return (
    <div data-index-grid="" data-layout={layout} data-cells="people" className="index-grid-person gap-3">
      {items.map((author) => (
        <Cell key={author.key} data-follow-author={author.key} data-kind="performer" name={entityDisplayName('creator', author.k, author.entity_id)}
          readout={author.held_by ? t('catalog:peopleIndex.updateCountUnconfirmed', { count: author.n }) : t('catalog:entityHero.updateCount', { count: author.n })} big={big}
          onPress={() => {
            if (author.entity_id) props.openEntity('creator', author.k);
            else if (author.held_by) props.openEntity('creator', author.held_by);
            else props.openFollowAuthor(author.key);
          }}>
          <Ring html={props.authorAvatar(author)} company={false} big={big} />
        </Cell>
      ))}
    </div>
  );
}
