import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../app/(tabs)/profile';

jest.mock('../../app/context/context', () => ({
  useStateContext: () => ({
    sharedState: 15,
    setSharedState: jest.fn(),
    phoneNumber: '1234567890',
    setPhoneNumber: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  it('displays the correct score and progress (AAA pattern)', () => {
    // Arrange & Act
    const { getByText } = render(<ProfileScreen />);

    // Assert
    expect(getByText(/Score: 15/)).toBeTruthy();
  });
}); 