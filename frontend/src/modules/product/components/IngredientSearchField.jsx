import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';

function normalizedName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd').toLocaleLowerCase('vi');
}

export function IngredientSearchField({ index, ingredients, selected, selectedIds, onSelect, onClear }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();
  const matches = ingredients.filter(ingredient => ingredient.active &&
    (!selectedIds.has(String(ingredient.id)) || String(ingredient.id) === String(selected?.id)) &&
    normalizedName(ingredient.name).includes(normalizedName(query)));
  const suggestions = matches.slice(0, 10);

  useEffect(() => {
    if (!open) return undefined;
    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const container = rootRef.current?.closest('.manager-recipe-lines');
    const menu = rootRef.current?.querySelector('[role="listbox"]');
    if (!container || !menu) return;
    const overflow = menu.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom;
    if (overflow > 0) container.scrollTop += overflow + 8;
  }, [open, query, suggestions.length]);

  useLayoutEffect(() => {
    if (!open) return;
    const menu = rootRef.current?.querySelector('[role="listbox"]');
    const active = menu?.querySelector('[data-active="true"]');
    if (!menu || !active) return;
    const below = active.getBoundingClientRect().bottom - menu.getBoundingClientRect().bottom;
    const above = menu.getBoundingClientRect().top - active.getBoundingClientRect().top;
    if (below > 0) menu.scrollTop += below;
    else if (above > 0) menu.scrollTop -= above;
  }, [open, activeIndex, query]);

  function choose(ingredient) {
    onSelect(ingredient);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setQuery('');
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) { setOpen(true); setQuery(''); setActiveIndex(0); return; }
      if (!suggestions.length) return;
      setActiveIndex(current => event.key === 'ArrowDown'
        ? Math.min(current + 1, suggestions.length - 1) : Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      if (suggestions[activeIndex]) choose(suggestions[activeIndex]);
    }
  }

  return <div className="manager-ingredient-search" ref={rootRef}>
    <Form.Control ref={inputRef} name="ingredientLines" type="search" role="combobox"
      aria-label={`Tìm nguyên liệu ${index + 1}`} aria-autocomplete="list"
      aria-expanded={open} aria-controls={open ? listId : undefined}
      aria-activedescendant={open && suggestions[activeIndex]
        ? `${listId}-${suggestions[activeIndex].id}` : undefined}
      autoComplete="off" placeholder="Tìm nguyên liệu..."
      value={open ? query : selected?.name || ''}
      onFocus={() => { setOpen(true); setQuery(''); setActiveIndex(0); }}
      onClick={() => {
        if (!open) { setOpen(true); setQuery(''); setActiveIndex(0); }
      }}
      onChange={event => {
        setQuery(event.target.value);
        setActiveIndex(0);
        setOpen(true);
        if (selected) onClear();
      }}
      onKeyDown={handleKeyDown}
      onBlur={event => {
        if (!rootRef.current?.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery('');
        }
      }} />
    {open && <div id={listId} role="listbox" aria-label="Gợi ý nguyên liệu"
      className="manager-ingredient-suggestions">
      {suggestions.length ? suggestions.map((ingredient, optionIndex) =>
        <button key={ingredient.id} id={`${listId}-${ingredient.id}`} type="button" role="option"
          aria-selected={optionIndex === activeIndex} data-active={optionIndex === activeIndex}
          className="manager-ingredient-option" tabIndex={-1}
          onMouseDown={event => event.preventDefault()}
          onClick={() => choose(ingredient)}>
          <span>{ingredient.name}</span><small>{ingredient.unit}</small>
        </button>) : <div className="manager-ingredient-no-results">
          {ingredients.length ? 'Không tìm thấy nguyên liệu phù hợp.' : 'Chưa có nguyên liệu.'}
        </div>}
    </div>}
  </div>;
}
