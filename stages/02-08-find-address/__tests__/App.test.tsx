import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../App';
import type { FetchImplementation, FetchResponse } from '../src/geocoding';

function response(payload: unknown, ok = true): FetchResponse {
  return { ok, json: async (): Promise<unknown> => payload };
}

function moscowResponse(): FetchResponse {
  return response([{ display_name: 'Moscow, Russia', lat: '55.7558', lon: '37.6173' }]);
}

const apiKeyName: string = 'EXPO_PUBLIC_GEOCODING_API_KEY';

beforeEach(() => {
  process.env[apiKeyName] = 'test-key';
});

afterEach(() => {
  delete process.env[apiKeyName];
});

test('geocodes an address and passes numeric coordinates to region and marker', async () => {
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  fetchImpl.mockResolvedValue(moscowResponse());
  const ui = render(<App fetchImpl={fetchImpl} />);

  fireEvent.changeText(ui.getByLabelText('Address'), 'Moscow');
  fireEvent.press(ui.getByRole('button', { name: 'SHOW' }));

  await waitFor(() => expect(ui.getByLabelText('Map')).toBeTruthy());
  expect(ui.getByLabelText('Map')).toHaveProp('region', {
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  expect(ui.getByLabelText('Address marker')).toHaveProp('coordinate', {
    latitude: 55.7558,
    longitude: 37.6173,
  });
});

test('blocks an empty address before fetch', () => {
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  const ui = render(<App fetchImpl={fetchImpl} />);

  fireEvent.press(ui.getByRole('button', { name: 'SHOW' }));

  expect(ui.getByRole('alert', { name: 'Address error' })).toHaveTextContent('Enter an address.');
  expect(fetchImpl).not.toHaveBeenCalled();
});

test('announces loading and retains the previous marker when a later request fails', async () => {
  let resolveRequest: ((value: FetchResponse) => void) | undefined;
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  fetchImpl
    .mockResolvedValueOnce(moscowResponse())
    .mockImplementationOnce(() => new Promise<FetchResponse>((resolve) => {
      resolveRequest = resolve;
    }));
  const ui = render(<App fetchImpl={fetchImpl} />);

  fireEvent.changeText(ui.getByLabelText('Address'), 'Moscow');
  fireEvent.press(ui.getByRole('button', { name: 'SHOW' }));
  await waitFor(() => expect(ui.getByLabelText('Map')).toBeOnTheScreen());

  fireEvent.changeText(ui.getByLabelText('Address'), 'Unknown place');
  fireEvent.press(ui.getByRole('button', { name: 'SHOW' }));
  expect(ui.getByText('Finding address…')).toHaveProp('accessibilityLiveRegion', 'polite');
  resolveRequest?.(response([], true));

  await waitFor(() => expect(ui.getByRole('alert', { name: 'Address error' })).toHaveTextContent('No address was found.'));
  expect(ui.getByLabelText('Address marker')).toBeOnTheScreen();
});

test('shows a missing-key error without requesting geocoding', async () => {
  delete process.env[apiKeyName];
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  const ui = render(<App fetchImpl={fetchImpl} />);

  fireEvent.changeText(ui.getByLabelText('Address'), 'Moscow');
  fireEvent.press(ui.getByRole('button', { name: 'SHOW' }));

  await waitFor(() => expect(ui.getByRole('alert', { name: 'Address error' })).toHaveTextContent(
    'Add EXPO_PUBLIC_GEOCODING_API_KEY to .env.',
  ));
  expect(fetchImpl).not.toHaveBeenCalled();
});
