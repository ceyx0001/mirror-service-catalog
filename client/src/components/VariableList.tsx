import { ReactElement } from "react";
import { VariableSizeList } from "react-window";

function Row({ index, style }) {
  return (
    <div style={style}>{/* define the row component using items[index] */}</div>
  );
}

export default function ListComponent({
  listSize,
  items,
}: {
  listSize: { width: number; height: number };
  items: { item: ReactElement; height: number }[];
}) {
  function getItemSize(index: number) {
    return items[index].height;
  }

  <VariableSizeList
    height={listSize.height}
    width={listSize.width}
    itemCount={items.length}
    itemSize={getItemSize}
  >
    {Row}
  </VariableSizeList>;
}
