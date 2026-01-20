export function getFuzzyRegex(verb) {
  const parts = verb.particles;
  const base = parts[0]; // e.g. "GO"
  
  // Common irregulars map
  const irregulars = {
    "GO": ["WENT", "GONE", "GOING", "GOES"],
    "COME": ["CAME", "COMING", "COMES"],
    "TAKE": ["TOOK", "TAKEN", "TAKING", "TAKES"],
    "GET": ["GOT", "GOTTEN", "GETTING", "GETS"],
    "GIVE": ["GAVE", "GIVEN", "GIVING", "GIVES"],
    "MAKE": ["MADE", "MAKING", "MAKES"],
    "SIT": ["SAT", "SITTING", "SITS"],
    "STAND": ["STOOD", "STANDING", "STANDS"],
    "BREAK": ["BROKE", "BROKEN", "BREAKING", "BREAKS"],
    "BRING": ["BROUGHT", "BRINGING", "BRINGS"],
    "BUY": ["BOUGHT", "BUYING", "BUYS"],
    "CATCH": ["CAUGHT", "CATCHING", "CATCHES"],
    "DO": ["DID", "DONE", "DOING", "DOES"],
    "FIND": ["FOUND", "FINDING", "FINDS"],
    "HAVE": ["HAD", "HAVING", "HAS"],
    "KEEP": ["KEPT", "KEEPING", "KEEPS"],
    "LEAVE": ["LEFT", "LEAVING", "LEAVES"],
    "LOSE": ["LOST", "LOSING", "LOSES"],
    "PUT": ["PUTTING", "PUTS"],
    "RUN": ["RAN", "RUNNING", "RUNS"],
    "SAY": ["SAID", "SAYING", "SAYS"],
    "SEE": ["SAW", "SEEN", "SEEING", "SEES"],
    "SEND": ["SENT", "SENDING", "SENDS"],
    "SPEAK": ["SPOKE", "SPOKEN", "SPEAKING", "SPEAKS"],
    "TELL": ["TOLD", "TELLING", "TELLS"],
    "THINK": ["THOUGHT", "THINKING", "THINKS"],
    "WEAR": ["WORE", "WORN", "WEARING", "WEARS"],
    "WRITE": ["WROTE", "WRITTEN", "WRITING", "WRITES"],
    "GROW": ["GREW", "GROWN", "GROWING", "GROWS"],
    "WAKE": ["WOKE", "WOKEN", "WAKING", "WAKES"],
    "HOLD": ["HELD", "HOLDING", "HOLDS"],
    "FALL": ["FELL", "FALLEN", "FALLING", "FALLS"]
  };

  const forms = [base, ...(irregulars[base] || [])];
  
  // Create a regex group for the verb part: (GO|WENT|GONE|...)
  const verbGroup = `(${forms.join("|")})`;
  
  // The rest of the particles are usually stable, but let's allow basic case insensitivity by just matching the word
  // But wait, the previous logic was p.slice(0,1) + "\\w*".
  // Let's stick to full words if possible, or fuzzy for particles?
  // Particles like "ON", "UP" are usually exact.
  // Exception: "AROUND" / "ROUND". 
  
  // Let's build the regex:
  // \b(GO|WENT|...)\b [\s\W]+ \bON\b
  // But handle separation!! "Take (the sweets) out".
  // Regex: \b(TAKE|TOOK|...)\b (.*?) \bOUT\b
  // We want to match the whole span?
  // If we assume the example sentence provided *contains* the phrasal verb.
  
  const particleGroup = parts.slice(1).map(p => `\\b${p}\\b`).join("[\\s\\W]+");
  
  // If we want to capture "separable" content, we use .*?
  // But be careful not to over-match.
  // Let's use [\s\W]+ for now, assuming adjacent or separated by simple punct/space?
  // Users examples: "I picked up my brother" (Adjacent). "Pick me up" (Separated).
  
  // We need to allow separation for 2-part verbs.
  // Strategy: Try adjacent match first? No.
  // Just use a wildcard separator that is non-greedy?
  // \b(VERBS)\b(?:[\s\W]+|[\s\W]+.*?[\s\W]+)\b(PARTICLE)\b
  
  // Simplified robust regex:
  // \b(VERBS)\w*\b ... \bPARTICLE\b
  // Note: \w* after verbs to catch -s, -ing if not in irregulars list.
  
  const verbPattern = `\\b${base.slice(0, 1)}\\w*\\b`; // Fallback heuristic with boundary
  // Actually, we can use the irregulars list combined with the start-letter heuristic.
  // Let's rely on the start letter heuristic with \b which is safer than before.
  // AND add specific irregulars that start with different letters (GO -> WENT).
  
  let verbFormsPattern = `\\b${base.slice(0, 1)}\\w*\\b`; // Default: G\w*
  
  if (irregulars[base]) {
     const differentStarts = irregulars[base].filter(f => f[0] !== base[0]);
     if (differentStarts.length > 0) {
        verbFormsPattern = `\\b(${base.slice(0, 1)}\\w*|${differentStarts.join("|")})\\b`;
     }
  }

  // Particles pattern: \bOUT\w*\b (allow matching casing/variants?)
  // Just \bOUT\b is safer to avoid matching "OUTSIDE".
  const particlesPattern = parts.slice(1).map(p => `\\b${p}\\w*\\b`).join("[\\s\\W]+");
  
  // Complete Regex: Verb ... (optional filler) ... Particles
  // We allow up to 5 words in between?
  // (?:[\s\W]+(?:\w+[\s\W]+){0,5})?
  
  // Return stricter regex to avoid swallowing objects like "the sweets".
  // Only match adjacent verb+particle (e.g. "going on", "picked up").
  // If a meaningful word is in between, we fail the match (and fallback to showing the verb definition task).
  // This prevents masking "take the sweets out" -> "_______".
  
  return new RegExp(`${verbFormsPattern}([\\s\\W]+)${particlesPattern}`, "i");
}
