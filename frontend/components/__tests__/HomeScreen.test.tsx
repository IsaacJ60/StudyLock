import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';

jest.mock('../../app/context/context', () => ({
  useStateContext: () => ({
    sharedState: 0,
    setSharedState: jest.fn(),
    phoneNumber: '1234567890',
    setPhoneNumber: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  it('toggles camera on button press (AAA pattern)', () => {
    // Arrange
    const { getByText } = render(<HomeScreen />);
    const focusButton = getByText('FOCUS');

    // Act
    fireEvent.press(focusButton);

    // Assert
    expect(getByText('STOP')).toBeTruthy();
  });
}); 