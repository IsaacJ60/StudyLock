import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskManagementScreen from '../../app/(tabs)/explore';

describe('TaskManagementScreen', () => {
  it('adds a new task to the todo column (AAA pattern)', () => {
    // Arrange
    const { getAllByPlaceholderText, getByText } = render(<TaskManagementScreen />);
    // There are three columns, so get the first input for 'todo'
    const inputs = getAllByPlaceholderText('Add a task');
    const todoInput = inputs[0];

    // Act
    fireEvent.changeText(todoInput, 'Test Task');
    fireEvent(todoInput, 'submitEditing');

    // Assert
    expect(getByText('Test Task')).toBeTruthy();
  });
}); 