import {
    Outlet,
    NavLink,
    Link,
    useLoaderData,
    Form,
    redirect,
    useNavigation,
    useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
    const { contacts, q } = useLoaderData();
    const [query, setQuery] = useState(q);
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
      navigation.location &&
      new URLSearchParams(navigation.location.search).has(
        "q"
      );

    useEffect(() => {
        setQuery(q);
      }, [q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <button type="button" onClick={() => {
              console.log('DESKTOP onClick');
              // Send pageview with a custom path
              ReactGA.send({ hitType: "DESKTOP pageview", page: "/my-path-DESKTOP" });

              // Send a custom event
              ReactGA.event({
                category: "DESKTOP category",
                action: "DESKTOP action",
                label: "DESKTOP label", // optional
                value: 99, // optional, must be a number
                nonInteraction: true, // optional, true/false
                transport: "xhr", // optional, beacon/xhr/image
              });
            }}
            >
              DESKTOP
            </button>
            <button type="button" onClick={() => {
              console.log('MOBILE onClick');
              // Send pageview with a custom path
              ReactGA.send({ hitType: "MOBILE pageview", page: "/my-path-MOBILE" });

              // Send a custom event
              ReactGA.event({
                category: "MOBILE category",
                action: "MOBILE action",
                label: "MOBILE label", // optional
                value: 99, // optional, must be a number
                nonInteraction: true, // optional, true/false
                transport: "xhr", // optional, beacon/xhr/image
              });
            }}
            >
              MOBILE
            </button>
          </div>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                value={query ? query : ''}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                  setQuery(event.target.value);
                  submit(event.currentTarget.form, {
                    replace: !isFirstSearch,
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
                <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
                <ul>
                {contacts.map((contact) => (
                    <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                          ? "pending"
                          : ""
                      }
                    >
                        {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                        ) : (
                        <i>No Name</i>
                        )}{" "}
                        {contact.favorite && <span>★</span>}
                    </NavLink>
                    </li>
                ))}
                </ul>
            ) : (
                <p>
                <i>No contacts</i>
                </p>
            )}
          </nav>
        </div>
        <div
            id="detail"
            className={
            navigation.state === "loading" ? "loading" : ""
            }
        >
            <Outlet />
        </div>
      </>
    );
  }