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
          {contact?.generalEmail && (
            <p className="contact-email">
              <span>{contact.generalEmailLabel || 'General enquiries'}</span>
              <a href={`mailto:${contact.generalEmail}`}>{contact.generalEmail}</a>
            </p>
          )}
          {contact?.note && <p className="note">{contact.note}</p>}
        </div>

        <form id="contact-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="field-label">
              <span>
                Name <span className="req" aria-label="required">*</span>
              </span>
              <input
                autoComplete="name"
                required
                maxLength={100}
                value={values.name}
                onChange={set('name')}
              />
            </label>

            <label className="field-label">
              <span>
                Country <span className="req" aria-label="required">*</span>
              </span>
              <input
                autoComplete="country-name"
                required
                maxLength={100}
                value={values.country}
                onChange={set('country')}
              />
            </label>

            <label className="field-label">
              <span>
                Email <span className="req" aria-label="required">*</span>
              </span>
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
              Phone number
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
