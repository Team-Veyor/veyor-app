import ChevronRightIcon from '@/assets/icons/ChevronRightIcon';
import List from '@/components/List/List';
import type { MenuItem } from '../types/menu';

interface UserMenuListProps {
  items: MenuItem[];
}

const UserMenuList = ({ items }: UserMenuListProps) => {
  return (
    <List>
      {items.map((item) => (
        <List.Item key={item.label} onClick={item.onSelect}>
          <List.Item.Content title={item.label} />
          <List.Item.Trailing>
            <ChevronRightIcon />
          </List.Item.Trailing>
        </List.Item>
      ))}
    </List>
  );
};

export default UserMenuList;
