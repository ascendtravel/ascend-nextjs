import { ListItem as ContextListItem, ItemAlignment } from './StickyScrollListContext';

// This is the base type that StickyScrollList context and DefaultCard might expect.
export type ListItem = ContextListItem;

// Make StickyCardRenderProps generic to allow for richer item types in custom renderItem functions.
// ItemType must at least have an 'id' as per the (now aliased) ContextListItem definition.
export interface StickyCardRenderProps<ItemType extends ListItem = ListItem> {
    item: ItemType;
    itemHeight: number;
    alignment: ItemAlignment;
    isCenter: boolean;
}
