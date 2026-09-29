import { useMemo, useState } from 'react';
import Dialog from './Dialog.jsx';
import { submitRegistration } from '../lib/api.js';

/**
 * Registering interest in a trial, in three steps.
 *
 * What the person types is posted once and never stored by us: the server
 * emails it to the centre they choose and keeps only the fact that it was
 * sent. Splitting it into three steps keeps each screen short, and means the
 * consent is read and given before any personal detail is asked for.
 */

const STEPS = ['Consent', 'Your details', 'About you'];

const BLANK = { firstName: '', lastName: '', email: '', phone: '', company: '' };

export default function RegistrationDialog({ trial, centres = [], onClose }) {
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [person, setPerson] = useState(BLANK);
  const [answers, setAnswers] = useState({});
  const [centreId, setCentreId] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const reg = trial?.registration ?? {};
  const questions = Array.isArray(reg.questions) ? reg.questions.filter((q) => q.question) : [];

  // A trial that names its centres offers only those; naming none offers all.
  const offered = useMemo(() => {
    const ids = Array.isArray(trial?.centreIds) ? trial.centreIds : [];
    return ids.length > 0 ? centres.filter((c) => ids.includes(c.id)) : centres;
  }, [trial, centres]);

  const set = (key) => (e) => setPerson((p) => ({ ...p, [key]: e.target.value }));

  function reset() {
    setStep(0);
    setConsent(false);
    setPerson(BLANK);
    setAnswers({});
    setCentreId('');
    setState('idle');
    setError('');
  }

  function close() {
    reset();
    onClose();
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    setError('');

    try {
      await submitRegistration({
        trialSlug: trial.slug,
        centreId,
        consent,
        firstName: person.firstName.trim(),
        lastName: person.lastName.trim(),
        email: person.email.trim(),
        phone: person.phone.trim(),
        company: person.company,
        answers: questions
          .map((q) => ({ question: q.question, answer: answers[q.question] ?? '' }))
          .filter((a) => a.answer !== ''),
      });
      setState('sent');
    } catch (err) {
      setState('error');
      setError(err.message || 'Your registration could not be sent.');
    }
  }

  const percent = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <Dialog open={Boolean(trial)} onClose={close} labelledBy="registration-title">
      {trial && (
        <div className="registration">
          <h2 id="registration-title">Registration Form</h2>

          {state === 'sent' ? (
            <>
              <p className="registration-success">
                {reg.successMessage ||
                  'Thank you — your registration has been sent to the study team at the centre you chose.'}
              </p>
              <button type="button" className="btn" onClick={close}>
                Close
              </button>
            </>
          ) : (
            <>
              {reg.intro && <p>{reg.intro}</p>}

              <div className="registration-progress">
                <span>
                  Step {step + 1} of {STEPS.length}
                </span>
                <span>{percent}%</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Step ${step + 1} of ${STEPS.length}`}
              >
                <div className="progress-bar" style={{ width: `${percent}%` }} />
              </div>

              <form onSubmit={onSubmit}>
                {/* Step 1 — consent, before anything personal is asked for. */}
                {step === 0 && (
                  <>
                    <fieldset className="registration-step">
                      <legend>
                        Pre-screening consent <em className="req">(Required)</em>
                      </legend>
                      <label className="consent-box">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                        />
                        <span>
                          {reg.consentLabel ||
                            'I have read the information above and consent to the collection and use of my information for study pre-screening.'}
                        </span>
                      </label>
                      {reg.consentBody && <p className="consent-body">{reg.consentBody}</p>}
                    </fieldset>

                    <div className="registration-actions">
                      <button
                        type="button"
                        className="btn"
                        disabled={!consent}
                        onClick={() => setStep(1)}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2 — how the centre gets back to them. */}
                {step === 1 && (
                  <>
                    <fieldset className="registration-step">
                      <legend className="sr-only">Your contact details</legend>
                      <div className="form-grid">
                        <label>
                          First name <em className="req">(Required)</em>
                          <input
                            required
                            autoComplete="given-name"
                            maxLength={100}
                            value={person.firstName}
                            onChange={set('firstName')}
                          />
                        </label>
                        <label>
                          Last name <em className="req">(Required)</em>
                          <input
                            required
                            autoComplete="family-name"
                            maxLength={100}
                            value={person.lastName}
                            onChange={set('lastName')}
                          />
                        </label>
                      </div>
                      <label>
                        Email address <em className="req">(Required)</em>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          maxLength={254}
                          value={person.email}
                          onChange={set('email')}
                        />
                      </label>
                      <label>
                        Phone number <em className="req">(Required)</em>
                        <input
                          type="tel"
                          required
                          autoComplete="tel"
                          maxLength={40}
                          value={person.phone}
                          onChange={set('phone')}
                        />
                      </label>

                      {/* Honeypot: hidden from people, tempting to bots. */}
                      <input
                        className="hp"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={person.company}
                        onChange={set('company')}
                      />
                    </fieldset>

                    <div className="registration-actions">
                      <button type="button" className="btn ghost" onClick={() => setStep(0)}>
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn"
                        disabled={
                          !person.firstName.trim() ||
                          !person.lastName.trim() ||
                          !person.email.trim() ||
                          !person.phone.trim()
                        }
                        onClick={() => setStep(2)}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3 — the trial's own questions, and which centre. */}
                {step === 2 && (
                  <>
                    <fieldset className="registration-step">
                      <legend className="sr-only">About you</legend>

                      {questions.map((q) => {
                        const options = Array.isArray(q.options)
                          ? q.options.filter(Boolean)
                          : [];
                        return (
                          <div className="question" key={q.question}>
                            <p className="question-label">{q.question}</p>
                            {options.length === 0 ? (
                              <input
                                type="text"
                                maxLength={500}
                                aria-label={q.question}
                                value={answers[q.question] ?? ''}
                                onChange={(e) =>
                                  setAnswers((a) => ({ ...a, [q.question]: e.target.value }))
                                }
                              />
                            ) : (
                              <div className="options">
                                {options.map((option) => (
                                  <label className="option" key={option}>
                                    <input
                                      type="radio"
                                      name={q.question}
                                      value={option}
                                      checked={answers[q.question] === option}
                                      onChange={() =>
                                        setAnswers((a) => ({ ...a, [q.question]: option }))
                                      }
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {q.helpText && <p className="note small">{q.helpText}</p>}
                          </div>
                        );
                      })}

                      <label>
                        {reg.centreLabel || 'Which centre is the most convenient for you?'}{' '}
                        <em className="req">(Required)</em>
                        <select
                          required
                          value={centreId}
                          onChange={(e) => setCentreId(e.target.value)}
                        >
                          <option value="">Select a centre</option>
                          {offered.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                              {c.region ? ` — ${c.region}` : ''}
                            </option>
                          ))}
                        </select>
                      </label>

                      {offered.length === 0 && (
                        <p className="note">
                          No centres are listed for this trial yet. Please use the contact form
                          instead.
                        </p>
                      )}
                    </fieldset>

                    {state === 'error' && <p className="registration-error">{error}</p>}

                    <div className="registration-actions">
                      <button type="button" className="btn ghost" onClick={() => setStep(1)}>
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="btn"
                        disabled={!centreId || state === 'sending'}
                      >
                        {state === 'sending' ? 'Sending…' : 'Submit'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}
