const library = document.querySelector('[data-learn-library]');
const input = document.querySelector('#learn-search-input');
const status = document.querySelector('#learn-search-status');

if (library && input && status) {
  const cards = [...library.querySelectorAll('.learn-card')];

  const update = () => {
    const query = input.value.trim().toLocaleLowerCase('en-CA');
    let visible = 0;

    cards.forEach((card) => {
      const matches = !query || card.textContent.toLocaleLowerCase('en-CA').includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    status.textContent = query
      ? `${visible} ${visible === 1 ? 'guide' : 'guides'} found.`
      : `${cards.length} guides available.`;
  };

  input.addEventListener('input', update);
  update();
}

const glossaryInput = document.querySelector('#learn-glossary-input');
const glossaryStatus = document.querySelector('#learn-glossary-status');
const terms = [...document.querySelectorAll('[data-glossary-term]')];

if (glossaryInput && glossaryStatus && terms.length) {
  const updateGlossary = () => {
    const query = glossaryInput.value.trim().toLocaleLowerCase('en-CA');
    let visible = 0;

    terms.forEach((term) => {
      const matches = !query || term.textContent.toLocaleLowerCase('en-CA').includes(query);
      term.hidden = !matches;
      if (matches) visible += 1;
    });

    glossaryStatus.textContent = `${visible} ${visible === 1 ? 'term' : 'terms'} shown.`;
  };

  glossaryInput.addEventListener('input', updateGlossary);
  updateGlossary();
}
