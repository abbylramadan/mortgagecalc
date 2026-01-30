import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helpText?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  helpText,
}: SelectProps) {
  const selected = options.find((opt) => opt.value === value);

  // Group options by group property
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              as={motion.button}
              whileFocus={{ scale: 1.01 }}
              className={`
                relative w-full px-4 py-3 text-lg text-left rounded-lg border-2
                transition-all duration-200 cursor-pointer
                ${error
                  ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                  : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                }
                bg-white
              `}
            >
              <span className={`block truncate ${!selected ? 'text-neutral-500' : ''}`}>
                {selected?.label || placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <div key={groupName}>
                    {Object.keys(groupedOptions).length > 1 && (
                      <div className="px-4 py-2 text-xs font-semibold text-neutral-500 bg-neutral-50">
                        {groupName}
                      </div>
                    )}
                    {groupOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-100 text-primary-900' : 'text-neutral-900'
                          }`
                        }
                      >
                        {({ selected: isSelected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                isSelected ? 'font-semibold' : 'font-normal'
                              }`}
                            >
                              {option.label}
                            </span>
                            {isSelected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error"
        >
          {error}
        </motion.p>
      )}

      {helpText && !error && (
        <p className="mt-2 text-sm text-neutral-500">{helpText}</p>
      )}
    </div>
  );
}
