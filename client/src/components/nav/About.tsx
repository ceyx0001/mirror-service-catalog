import useFade from "../../hooks/useFade";

// dialog containing app information
export function About() {
  const { visible, faded, handleToggle, hide } = useFade();

  return (
    <div className="relative text-primary z-10">
      <button
        type="button"
        aria-label="About"
        className=" hover:brightness-200 transition text-primary"
        onClick={handleToggle}
      >
        <span className="text-primary">About</span>
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 ${
          visible ? "animate-fade-in" : "animate-fade-out"
        } ${faded && "hidden"}`}
      >
        <div
          className="fixed inset-0 z-10 w-screen overflow-y-auto"
          onClick={hide}
        >
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-3xl bg-black text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg border-secondary border">
              <div className="bg-background px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6"
                      id="modal-title"
                    >
                      What does this app do?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm">
                        The app compiles all forum posts from GGG's
                        <a
                          href="https://www.pathofexile.com/forum/view-forum/standard-trading-shops"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary text-accent brightness-125 hover:brightness-100 transition"
                        >
                          {" "}
                          Standard Trading Shops
                        </a>
                        . It organizes all that are up for Mirror Service or are
                        part of a Mirror Shop. It will only show items from
                        forum threads whose titles have the words "mirror shop"
                        or "mirror service" in them. Each profile can have one
                        mirror thread indexed at a time (the highest indxed
                        thread in the 50 pages).
                        <br />
                        <br /> Currently, jewels have not been added because
                        they have a different item format.
                      </p>
                    </div>
                    <h3
                      className="text-base font-semibold leading-6 mt-10 text-accent"
                      id="modal-title"
                    >
                      How does the search work?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm mb-10">
                        Users are able to add keyword filters which will then be
                        used by the app to search for items.
                        <br />
                        <br />
                        Title filters matches shop titles.
                        <br />
                        Base filters matches an item's quality (don't use %),
                        base, or name.
                        <br />
                        Mod filters matches any item mod (any text below it's
                        quality).
                        <br />
                        <b>This tool is in no way affiliated with GGG.</b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  aria-label="Okay"
                  className="inline-flex w-full justify-center rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent sm:ml-3 sm:w-auto"
                  onClick={handleToggle}
                >
                  Okay!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
