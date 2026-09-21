import { forwardRef, useState } from 'react';
import { submitEnquiry } from '../lib/api.js';

const EMPTY = { name: '', country: '', email: '', phone: '', message: '', company: '' };

/**
 * The enquiry form. `messageRef` is forwarded so "Enquire about this trial"
 * in the trial dialog can prefill and focus the textarea.
 */
const Contact = forwardRef(function Contact({ contact, trialSlug }, messageRef) {
  const [values, setValues] = useState(EMPTY);
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [status, setStatus] = useState('');

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    setStatus('Sending your enquiry…');

    try {
      await submitEnquiry({ ...values, trialSlug: trialSlug ?? '' });
      setState('sent');
      setStatus(contact?.successMessage ?? 'Thank you — your enquiry has been received.');
      setValues(EMPTY);
    } catch (err) {
      setState('error');
      setStatus(err.message || contact?.errorMessage || 'Your enquiry could not be sent.');
    }
  }

  return (
    <section id="contact">
      <div className="wrap contact-grid">
        <div>
          {contact?.eyebrow && <span className="eyebrow">{contact.eyebrow}</span>}
          <h2>{contact?.title}</h2>
          {(contact?.paragraphs ?? []).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {contact?.note && <p className="note">{contact.note}</p>}
        </div>

        <form id="contact-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label>
              Name
              <input
                autoComplete="name"
                required
                maxLength={100}
                value={values.name}
                onChange={set('name')}
              />
            </label>
            <label>
              Country
              <input
                autoComplete="country-name"
                required
                maxLength={100}
                value={values.country}
                onChange={set('country')}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={values.email}
                onChange={set('email')}
              />
            </label>
            <label>
              Phone number · optional
              <input
                type="tel"
                autoComplete="tel"
                maxLength={40}
                value={values.phone}
                onChange={set('phone')}
              />
            </label>
            <label className="full">
              Your enquiry
              <textarea
                ref={messageRef}
                id="enquiry"
                rows={5}
                required
                maxLength={2000}
                value={values.message}
                onChange={set('message')}
              />
            </label>

            {/* Honeypot: hidden from people, irresistible to bots. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={values.company}
              onChange={set('company')}
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
            />

            <div className="full">
              {contact?.formNote && <p className="small">{contact.formNote}</p>}
              <button className="btn" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : (contact?.submitLabel ?? 'Send Enquiry ↗')}
              </button>
              <p id="form-status" className="status" role="status">
                {status}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
});

export default Contact;
