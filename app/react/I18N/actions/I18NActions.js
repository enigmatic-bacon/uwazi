import { actions as formActions } from 'react-redux-form';
import * as notifications from 'app/Notifications/actions/notificationsActions';
import { store } from 'app/store';
import { RequestParams } from 'app/utils/RequestParams';

import { httpRequest } from 'shared/superagent';
import t from '../t';
import I18NApi from '../I18NApi';

export function inlineEditTranslation(contextId, key) {
  return dispatch => {
    const state = store.getState();
    const translations = state.translations.toJS();
    const languages = translations.map(_t => _t.locale);
    const formData = languages.reduce((values, locale) => {
      const translation = translations.find(_t => _t.locale === locale);
      const context = translation.contexts.find(c => c.id === contextId);
      values[locale] = context.values[key] || key; // eslint-disable-line no-param-reassign
      return values;
    }, {});

    dispatch({ type: 'OPEN_INLINE_EDIT_FORM', context: contextId, key });
    dispatch(formActions.load('inlineEditModel', formData));
  };
}

export function closeInlineEditTranslation() {
  return dispatch => {
    dispatch({ type: 'CLOSE_INLINE_EDIT_FORM' });
    dispatch(formActions.reset('inlineEditModel'));
  };
}

export function toggleInlineEdit() {
  return { type: 'TOGGLE_INLINE_EDIT' };
}

export function saveTranslations(translations) {
  return dispatch => {
    Promise.all(translations.map(translation => I18NApi.save(new RequestParams(translation)))).then(
      () => {
        notifications.notify(t('System', 'Translations saved', null, false), 'success')(dispatch);
      }
    );
  };
}

export function importTranslations(context, file) {
  return async dispatch => {
    try {
      const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      const fields = {
        context,
      };
      const translations = await httpRequest('translations/import', fields, headers, file);
      await dispatch(formActions.load('translationsForm', translations));
      notifications.notify(t(context, 'Translations imported.', null, false), 'success')(dispatch);
    } catch (e) {
      notifications.notify(t(context, e.error, null, false), 'danger')(dispatch);
    }
  };
}

export function editTranslations(translations) {
  return dispatch => {
    dispatch(formActions.load('translationsForm', translations));
  };
}

export function resetForm() {
  return dispatch => {
    dispatch(formActions.reset('translationsForm'));
  };
}

export function addLanguage(language) {
  return dispatch =>
    I18NApi.addLanguage(new RequestParams(language)).then(() => {
      notifications.notify(t('System', 'New language added', null, false), 'success')(dispatch);
    });
}

export function deleteLanguage(key) {
  return dispatch =>
    I18NApi.deleteLanguage(new RequestParams({ key })).then(() => {
      notifications.notify(t('System', 'Language deleted', null, false), 'success')(dispatch);
    });
}

export function setDefaultLanguage(key) {
  return dispatch =>
    I18NApi.setDefaultLanguage(new RequestParams({ key })).then(() => {
      notifications.notify(
        t('System', 'Default language change success', null, false),
        'success'
      )(dispatch);
    });
}

export function resetDefaultTranslations(key) {
  return dispatch =>
    I18NApi.populateTranslations(new RequestParams({ locale: key })).then(() => {
      notifications.notify(
        t('System', 'Translations reset successfully', null, false),
        'success'
      )(dispatch);
    });
}
