import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { UserGroupsLookupField } from '../UserGroupsLookupField';
import { MemberWithPermission } from '../../EntityPermisions';

describe('UserGroupsLookupField', () => {
  let onChangeMock: (search: string) => void;
  let onSelectMock: (value: MemberWithPermission) => void;

  beforeEach(() => {
    onChangeMock = jest.fn();
    onSelectMock = jest.fn();
  });

  it('should render the options', () => {
    const options: MemberWithPermission[] = [
      {
        id: 'id',
        label: 'label',
        type: 'user',
        level: 'read',
      },
      {
        id: 'id2',
        label: 'label',
        type: 'group',
      },
    ];

    const component = shallow(
      <UserGroupsLookupField
        onChange={onChangeMock}
        onSelect={onSelectMock}
        value=""
        options={options}
      />
    );

    component
      .find('input')
      .first()
      .simulate('focus');

    const items = component.find('li');
    expect(items.find({ value: options[0] }).length).toBe(1);
    expect(items.find({ value: options[1] }).length).toBe(1);
    expect(items.length).toBe(2);
  });

  it('should trigger onChange when typing', () => {
    const component = shallow(
      <UserGroupsLookupField
        onChange={onChangeMock}
        onSelect={onSelectMock}
        value=""
        options={[]}
      />
    );

    component
      .find('input')
      .first()
      .simulate('focus');

    component.find('input').simulate('change', { target: { value: 'new value' } });

    expect(onChangeMock).toHaveBeenCalledWith('new value');
  });

  it('should trigger onSelect when clicking an option', () => {
    const component = shallow(
      <UserGroupsLookupField
        onChange={onChangeMock}
        onSelect={onSelectMock}
        value=""
        options={[
          {
            id: 'id',
            label: 'label',
            type: 'user',
          },
        ]}
      />
    );

    component
      .find('input')
      .first()
      .simulate('focus');

    component.find('li').simulate('click');

    expect(onSelectMock).toHaveBeenCalledWith({
      id: 'id',
      label: 'label',
      type: 'user',
    });
  });

  describe('keyboard use', () => {
    let component: ShallowWrapper;

    const getEvent = (key: string) => ({ preventDefault: () => {}, key });

    beforeEach(() => {
      component = shallow(
        <UserGroupsLookupField
          onChange={onChangeMock}
          onSelect={onSelectMock}
          value=""
          options={[
            {
              id: 'id1',
              label: 'user',
              type: 'user',
            },
            {
              id: 'id2',
              label: 'group',
              type: 'group',
            },
            {
              id: 'id3',
              label: 'group2',
              type: 'group',
            },
            {
              id: 'id4',
              label: 'user2',
              type: 'user',
            },
          ]}
        />
      );

      component
        .find('input')
        .first()
        .simulate('focus');
    });

    it('should not trigger an event if Enter press with no seletion', () => {
      component.find('input').simulate('keydown', getEvent('Enter'));

      const selected = component.find('.selected');

      expect(selected.length).toBe(0);
      expect(onSelectMock).not.toHaveBeenCalled();
    });

    it('should select last when hiting up with no selection', async () => {
      component.find('input').simulate('keydown', getEvent('ArrowUp'));
      const items = component.find('li');

      await expect(items.get(3).props.className).toMatch('selected');
    });

    it('should select first when hiting down with no selection', async () => {
      component.find('input').simulate('keydown', getEvent('ArrowDown'));
      const items = component.find('li');

      await expect(items.get(0).props.className).toMatch('selected');
    });

    it('should navigate up when hiting up with selection', async () => {
      component.find('input').simulate('keydown', getEvent('ArrowUp'));
      component.find('input').simulate('keydown', getEvent('ArrowUp'));

      const items = component.find('li');

      await expect(items.get(2).props.className).toMatch('selected');
    });

    it('should navigate down when hiting down with selection', async () => {
      component.find('input').simulate('keydown', getEvent('ArrowDown'));
      component.find('input').simulate('keydown', getEvent('ArrowDown'));

      const items = component.find('li');

      await expect(items.get(1).props.className).toMatch('selected');
    });

    it('should trigger an event if Enter press with selection', () => {
      component.find('input').simulate('keydown', getEvent('ArrowDown'));
      component.find('input').simulate('keydown', getEvent('Enter'));

      expect(onSelectMock).toHaveBeenCalledWith({
        id: 'id1',
        label: 'user',
        type: 'user',
      });
    });

    it('should clear the input if Esc pressed', () => {
      component.find('input').simulate('keydown', getEvent('Escape'));

      expect(onChangeMock).toHaveBeenCalledWith('');
    });
  });
});
