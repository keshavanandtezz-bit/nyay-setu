export const precedents = [
  {
    id: 'P001',
    title: 'State of Maharashtra vs. Salman Khan',
    citation: '2015 AIR SC 3458',
    court: 'Supreme Court of India',
    year: 2015,
    ipc_sections: ['IPC 304A', 'IPC 279'],
    keywords: ['rash driving', 'culpable homicide', 'motor vehicle', 'accident'],
    outcome: 'Convicted',
    summary: 'The court held that causing death by rash and negligent driving falls under Section 304A IPC. Sentence of 5 years RI upheld by the High Court was reduced to 1 year by Supreme Court.',
    relevance_tags: ['accident', 'negligence', 'motor vehicle'],
    key_principle: 'Rash and negligent driving that causes death attracts culpable homicide not amounting to murder under Section 304A.',
  },
  {
    id: 'P002',
    title: 'Arnesh Kumar vs. State of Bihar',
    citation: '(2014) 8 SCC 273',
    court: 'Supreme Court of India',
    year: 2014,
    ipc_sections: ['IPC 498A', 'CrPC 41'],
    keywords: ['arrest', 'dowry', 'domestic violence', 'bail', 'Section 498A'],
    outcome: 'Guidelines Issued',
    summary: 'Supreme Court issued mandatory guidelines that police must not automatically arrest under Section 498A. Magistrates must apply mind before authorising detention. A checklist system was mandated.',
    relevance_tags: ['498A', 'domestic violence', 'arrest guidelines'],
    key_principle: 'Arrest is not a must in all Section 498A cases. Courts must ensure power of arrest is not exercised as a matter of course.',
  },
  {
    id: 'P003',
    title: 'Hussainara Khatoon vs. State of Bihar',
    citation: '(1980) 1 SCC 81',
    court: 'Supreme Court of India',
    year: 1980,
    ipc_sections: ['CrPC 167', 'Article 21'],
    keywords: ['undertrial', 'speedy trial', 'bail', 'fundamental rights', 'custody'],
    outcome: 'Bail Granted — Landmark',
    summary: 'The Supreme Court held that the right to speedy trial is a fundamental right under Article 21. Undertrials who have spent more time in prison than their maximum sentence must be released.',
    relevance_tags: ['undertrial', 'speedy trial', 'bail rights', 'Article 21'],
    key_principle: 'Prolonged incarceration without trial violates Article 21. Courts must release undertrials who have served potential maximum sentence.',
  },
  {
    id: 'P004',
    title: 'State of Rajasthan vs. Balchand',
    citation: 'AIR 1977 SC 2447',
    court: 'Supreme Court of India',
    year: 1977,
    ipc_sections: ['CrPC 437', 'CrPC 439'],
    keywords: ['bail', 'conditions', 'personal liberty', 'bail principles'],
    outcome: 'Bail Granted with Conditions',
    summary: 'The Supreme Court established the golden rule that bail is the rule and jail is the exception. Courts should lean towards granting bail unless there are strong reasons for denial.',
    relevance_tags: ['bail', 'liberty', 'bail as rule'],
    key_principle: 'Bail is the rule, jail is the exception. The primary considerations are likelihood of flight and danger to society.',
  },
  {
    id: 'P005',
    title: 'Sanjay Chandra vs. CBI',
    citation: '(2012) 1 SCC 40',
    court: 'Supreme Court of India',
    year: 2012,
    ipc_sections: ['IPC 120B', 'IPC 420', 'CrPC 437'],
    keywords: ['bail', 'economic offence', 'flight risk', 'fraud'],
    outcome: 'Bail Granted',
    summary: 'The Supreme Court granted bail in the 2G spectrum case, holding that the object of bail is to secure the appearance of the accused and not to punish them before trial.',
    relevance_tags: ['bail', 'economic offence', 'cheating'],
    key_principle: 'Deprivation of liberty before conviction is a serious matter. Gravity of offence alone cannot be ground for bail refusal.',
  },
  {
    id: 'P006',
    title: 'Nikesh Tarachand Shah vs. Union of India',
    citation: '(2018) 11 SCC 1',
    court: 'Supreme Court of India',
    year: 2018,
    ipc_sections: ['PMLA Sec 45', 'Article 21'],
    keywords: ['PMLA', 'money laundering', 'bail', 'twin conditions', 'constitutional'],
    outcome: 'Provision Struck Down — Bail Conditions Relaxed',
    summary: 'The Supreme Court struck down Section 45 of PMLA as unconstitutional for imposing reverse burden and twin conditions for bail which violated Articles 14 and 21 of the Constitution.',
    relevance_tags: ['PMLA', 'money laundering', 'bail', 'constitutional'],
    key_principle: 'Twin conditions for bail under PMLA that presumed guilt and reversed burden of proof were held unconstitutional.',
  },
  {
    id: 'P007',
    title: 'Dataram Singh vs. State of Uttar Pradesh',
    citation: '(2018) 3 SCC 22',
    court: 'Supreme Court of India',
    year: 2018,
    ipc_sections: ['CrPC 437', 'CrPC 439', 'IPC 302'],
    keywords: ['bail cancellation', 'murder', 'anticipatory bail', 'conditions'],
    outcome: 'Bail Conditions Clarified',
    summary: 'The Supreme Court reiterated that while deciding bail, the court must assess flight risk, tampering with evidence, likelihood of repetition of offence and not merely the seriousness of the charge.',
    relevance_tags: ['bail', 'murder', 'bail conditions'],
    key_principle: 'Three factors for bail: likelihood of fleeing, tampering with evidence or witnesses, repeating the offence. Gravity alone is insufficient.',
  },
  {
    id: 'P008',
    title: 'Prabhakar Rao vs. State of Andhra Pradesh',
    citation: '(1985) AIR SC 973',
    court: 'Supreme Court of India',
    year: 1985,
    ipc_sections: ['IPC 406', 'IPC 420', 'IPC 467'],
    keywords: ['cheating', 'criminal breach of trust', 'forgery', 'conviction'],
    outcome: 'Conviction Upheld',
    summary: 'The Supreme Court held that in cases of cheating involving forged documents, the prosecution must prove criminal intention and that the accused knew the documents were forged.',
    relevance_tags: ['cheating', 'forgery', 'criminal intention'],
    key_principle: 'Criminal intention is the essence of cheating under Section 420. Mere non-performance of contract is not sufficient without dishonest intent.',
  },
];

export function searchPrecedents(query, ipcSection) {
  const q = query.toLowerCase().trim();
  const ipc = ipcSection.toLowerCase().trim();

  return precedents.filter(p => {
    const matchesQuery = !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q)) ||
      p.key_principle.toLowerCase().includes(q);

    const matchesIPC = !ipc ||
      p.ipc_sections.some(s => s.toLowerCase().includes(ipc)) ||
      p.keywords.some(k => k.toLowerCase().includes(ipc));

    return matchesQuery || matchesIPC;
  });
}