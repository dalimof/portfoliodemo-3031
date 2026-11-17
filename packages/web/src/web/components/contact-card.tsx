import { ArrowUpRight, Check, Instagram, Loader2, Send } from "lucide-react";
import { useContact } from "../queries/contact";

export function ContactCard() {
  const contact = useContact();
  return (
    <div className="contact-card reveal">
      <div className="contact-intro">
        <span className="availability">
          <i /> OPEN TO COLLABORATIONS
        </span>
        <h3>
          Have a big idea?
          <br />
          <em>Let's make it real.</em>
        </h3>
        <p>Something ambitious, something unexpected, or just a hello. My inbox is open.</p>
        <div className="social-links">
          <a href="https://t.me/dalimoff" target="_blank" rel="noreferrer">
            <Send size={19} />
            <span>
              Telegram<small>@dalimoff</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a href="https://instagram.com/8dali" target="_blank" rel="noreferrer">
            <Instagram size={19} />
            <span>
              Instagram<small>@8dali</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="contact-form-wrap">
        {contact.isSuccess ? (
          <output className="form-success" aria-live="polite">
            <span>
              <Check size={28} />
            </span>
            <h3>
              A good idea starts
              <br />
              with a hello.
            </h3>
            <p>Your message has been saved. Thanks for reaching out.</p>
            <button className="text-button" onClick={() => contact.reset()}>
              Send another message <ArrowUpRight size={16} />
            </button>
          </output>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              contact.mutate({
                name: String(data.get("name")),
                email: String(data.get("email")),
                message: String(data.get("message")),
                website: String(data.get("website") ?? ""),
              });
            }}
          >
            <div className="form-row">
              <label>
                Your name
                <input
                    aria-label="Your name"
                  required
                  minLength={2}
                  maxLength={100}
                  name="name"
                  autoComplete="name"
                  placeholder="What's your name?"
                />
              </label>
              <label>
                Email address
                <input
                    aria-label="Email address"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@yourworld.com"
                />
              </label>
            </div>
            <label>
              A little about your idea
              <textarea
                  aria-label="A little about your idea"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                placeholder="Tell me what you're dreaming of…"
              />
            </label>
            <input
              className="honeypot"
              name="website"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />
            {contact.isError && (
              <p className="form-error" role="alert">
                {contact.error.message || "Message could not be saved. Please try again."}
              </p>
            )}
            <button className="dark-button" disabled={contact.isPending}>
              {contact.isPending ? "Sending…" : "Send a message"}
              {contact.isPending ? (
                <Loader2 className="spin" size={18} />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </button>
            <small className="form-note">Your message stays private. Good things start here.</small>
          </form>
        )}
      </div>
    </div>
  );
}
