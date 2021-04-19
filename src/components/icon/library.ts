import { SlIcon } from '../../shoelace';
import { getBasePath } from '../../utilities/base-path';
import { icons as shoelaceIcons } from './library.system';

export type IconLibraryResolver = (name: string) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;

interface IconLibraryRegistry {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}

let registry: IconLibraryRegistry[] = [
  // The system library (used internally by components)
  {
    name: 'system',
    resolver: (name: keyof typeof shoelaceIcons) => {
      if (shoelaceIcons[name]) {
        return `data:image/svg+xml,${encodeURIComponent(shoelaceIcons[name])}`;
      } else {
        return '';
      }
    }
  },

  // Bootstrap Icons
  {
    name: 'default',
    resolver: name => `${getBasePath()}/assets/icons/${name}.svg`
  }
];
let watchedIcons: SlIcon[] = [];

export function watchIcon(icon: SlIcon) {
  watchedIcons.push(icon);
}

export function unwatchIcon(icon: SlIcon) {
  watchedIcons = watchedIcons.filter(el => el !== icon);
}

export function getIconLibrary(name?: string) {
  return registry.filter(lib => lib.name === name)[0];
}

export function registerIconLibrary(
  name: string,
  options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator }
) {
  unregisterIconLibrary(name);
  registry.push({
    name,
    resolver: options.resolver,
    mutator: options.mutator
  });

  // Redraw watched icons
  watchedIcons.map(icon => {
    if (icon.library === name) {
      icon.redraw();
    }
  });
}

export function unregisterIconLibrary(name: string) {
  registry = registry.filter(lib => lib.name !== name);
}
