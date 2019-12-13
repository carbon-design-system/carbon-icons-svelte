import { ICarbonIcon } from './createComponent';

function formatName({ name, size }: Pick<ICarbonIcon, 'name' | 'size'>) {
  if (!size) {
    return null;
  }

  const formattedName = name
    .split('-')
    .filter(Boolean)
    .map(fragment => {
      return [fragment.slice(0, 1).toUpperCase(), fragment.slice(1)].join('');
    });

  const first = formattedName[0];

  if (first.slice(0, 1).match(new RegExp(/[0-9]/g))) {
    if (['3D', '3DICa', '3rd'].includes(first)) {
      formattedName.unshift('WatsonHealth');
    } else {
      formattedName.unshift('_');
    }
  }

  // TODO: make constant
  if (
    [
      'Angle',
      'AnnotationVisibility',
      'ArrowAnnotation',
      'AutoScroll',
      'CdArchive',
      'CdCreateArchive',
      'CircleMeasurement',
      'CobbAngle',
      'CrossReference',
      'Denominate',
      'DicomOverlay',
      'EditFilter',
      'FusionBlender',
      'HangingProtocol',
      'LaunchStudy',
      'Magnify',
      'Mammogram',
      'Nominate',
      'PageScroll',
      'PetImageB',
      'PetImageO',
      'PointerText',
      'RegionAnalysisArea',
      'RegionAnalysisVolume',
      'Registration',
      'SaveAnnotation',
      'SaveImage',
      'SaveSeries',
      'SpineLabel',
      'StackedMove',
      'StackedScrolling_1',
      'StackedScrolling_2',
      'StressBreathEditor',
      'StudyNext',
      'StudyPrevious',
      'StudySkip',
      'WindowAuto',
      'WindowBase',
      'WindowOverlay',
      'ZoomPan'
    ].includes(first)
  ) {
    formattedName.unshift('WatsonHealth');
  }

  formattedName.push(size.toString());

  return formattedName.join('');
}

export { formatName };
