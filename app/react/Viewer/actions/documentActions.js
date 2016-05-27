import * as types from 'app/Viewer/actions/actionTypes';
import api from 'app/utils/api';

import {viewerSearching} from 'app/Viewer/actions/uiActions';
import {actions} from 'app/BasicReducer';
import documents from 'app/Documents';
import {notify} from 'app/Notifications';

export function setDocument(document, html) {
  return {
    type: types.SET_DOCUMENT,
    document,
    html
  };
}

export function resetDocumentViewer() {
  return {
    type: types.RESET_DOCUMENT_VIEWER
  };
}

export function loadDefaultViewerMenu() {
  return {
    type: types.LOAD_DEFAULT_VIEWER_MENU
  };
}

export function saveDocument(doc) {
  return function (dispatch) {
    return documents.api.save(doc)
    .then(() => {
      dispatch(notify('Document updated', 'success'));
      dispatch({type: types.VIEWER_UPDATE_DOCUMENT, doc});
    });
  };
}

export function loadTargetDocument(id) {
  return function (dispatch) {
    // dispatch(viewerSearching());

    return Promise.all([
      api.get('documents?_id=' + id),
      api.get('documents/html?_id=' + id)
    ])
    .then((response) => {
      dispatch({
        type: types.SET_TARGET_DOCUMENT,
        document: response[0].json.rows[0],
        html: response[1].json
      });
    });
  };
}

export function viewerSearchDocuments(searchTerm) {
  return function (dispatch) {
    dispatch(viewerSearching());

    return api.get('documents/search?searchTerm=' + searchTerm)
    .then((response) => {
      dispatch(actions.set('viewer/documentResults', response.json));
    });
  };
}
