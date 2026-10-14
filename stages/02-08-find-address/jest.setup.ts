import type { ComponentProps, ComponentType, ReactElement, ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';

type mockMapViewTestProps = ViewProps & {
  readonly accessibilityLabel?: string;
  readonly children?: ReactNode;
  readonly region?: Region;
};

type mockMarkerTestProps = ViewProps & {
  readonly accessibilityLabel?: string;
  readonly coordinate?: LatLng;
  readonly title?: string;
};

jest.mock('react-native-maps', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  type mockTestViewProps = ComponentProps<typeof View> & mockMapViewTestProps & mockMarkerTestProps;
  const mockTestView = View as ComponentType<mockTestViewProps>;

  const mockMapView = ({ children, ...props }: mockMapViewTestProps): ReactElement => (
    React.createElement(mockTestView, props, children)
  );
  const mockMarker = (props: mockMarkerTestProps): ReactElement => React.createElement(mockTestView, props);

  return { __esModule: true, default: mockMapView, Marker: mockMarker };
});
