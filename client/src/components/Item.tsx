import "../index.css";

const url =
  "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Cb3dzL0JvdzkiLCJ3IjoyLCJoIjo0LCJzY2FsZSI6MX1d/aa9bf2b0d1/Bow9.png";
const enchant = [
  "Quality does not increase Physical Damage",
  "Grants 1% increased Area of Effect per 4% Quality",
];
const implicit = [
  "10% increased Movement Speed",
  "Item sells for much more to vendors",
];
const explicit = [
  "+1 to Level of Socketed Strength Gems",
  "+1 to Level of Socketed Intelligence Gems",
  "+1 to Level of Socketed Gems",
  "Minions have 59% increased maximum Life",
  "Minions deal 59% increased Damage",
];
const fractured: string[] = [];
const crafted = ["+2 to Level of Socketed Support Gems"];
const crucible = [
  "6% increased Attributes",
  "10% increased Strength",
  "20% increased Dexterity",
  "10% increased Intelligence",
  "20% increased Global Damage",
  "Magebane",
];
const base = "Maraketh Bow";
const name = "Torment Mark";
const quality = 30;
const details = [
  { color: "text-crafted", mods: enchant },
  { color: "text-mod", mods: implicit },
  { color: "text-mod", mods: explicit },
  { color: "text-fractured", mods: fractured },
  { color: "text-crafted", mods: crafted },
  { color: "text-crucible", mods: crucible },
];
const id = "81e0b381caed2fc94ddf07b8bc67b7c6c918997bf973815fdd791f51383a2d49";

function Item() {
  return (
    <article className="bg-secondary bg-opacity-40 grid place-content-center text-center w-1/6 rounded-3xl p-4">
      <img src={url} className="justify-self-center" />
      <div className="place-content-center">
        <p className="py-2">
          {name} {base}
        </p>
        <p className="py-2 text-xs">Quality: {quality}%</p>
        {details.map((detail, i) => (
          <div className="py-1 text-xs">
            {detail.mods.map((text, j) => (
              <p className={details[i].color} key={`${id}${j}`}>
                {text}
              </p>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}

export default Item;
