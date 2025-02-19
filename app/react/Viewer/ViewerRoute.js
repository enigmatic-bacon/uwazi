import RouteHandler from 'app/App/RouteHandler';
import EntitiesAPI from 'app/Entities/EntitiesAPI';
import React from 'react';
import { actions as formActions } from 'react-redux-form';
import { actions } from 'app/BasicReducer';
import * as relationships from 'app/Relationships/utils/routeUtils';
import { showTab } from 'app/Entities/actions/uiActions';
import PDFView from './PDFView';
import EntityView from './EntityView';
import ViewerComponent from './components/ViewerComponent';
import { setReferences } from './actions/referencesActions';

class ViewerRoute extends RouteHandler {
  static async requestState(requestParams, globalResources) {
    const { sharedId } = requestParams.data;
    const [entity] = await EntitiesAPI.get(
      requestParams.set({ sharedId, omitRelationships: true })
    );

    return entity.documents.length
      ? PDFView.requestState(requestParams, globalResources)
      : EntityView.requestState(requestParams, globalResources);
  }

  componentWillUnmount() {
    this.emptyState();
  }

  emptyState() {
    this.context.store.dispatch(actions.unset('viewer/doc'));
    this.context.store.dispatch(actions.unset('viewer/templates'));
    this.context.store.dispatch(actions.unset('viewer/thesauris'));
    this.context.store.dispatch(actions.unset('viewer/relationTypes'));
    this.context.store.dispatch(actions.unset('viewer/rawText'));
    this.context.store.dispatch(formActions.reset('documentViewer.tocForm'));
    this.context.store.dispatch(actions.unset('viewer/targetDoc'));
    this.context.store.dispatch(setReferences([]));
    this.context.store.dispatch(actions.unset('entityView/entity'));
    this.context.store.dispatch(relationships.emptyState());
  }

  urlHasChanged(nextProps) {
    const { sharedId: oldSharedId, lang: oldLang } = nextProps.params;
    const { sharedId: newSharedId, lang: newLang } = this.props.params;
    if (newSharedId === oldSharedId && newLang === oldLang) {
      return false;
    }
    const { query } = this.props.location;
    const { query: nextQuery } = nextProps.location;
    const sameQueryFile = query.file === nextQuery.file;
    return super.urlHasChanged(nextProps) || !sameQueryFile;
  }

  selectTab({ tabView }) {
    let tab = tabView;
    if (!tab) tab = 'metadata';
    this.context.store.dispatch(actions.set('viewer.sidepanel.tab', tab));
    this.context.store.dispatch(showTab(tab === 'metadata' ? 'info' : tab));
  }

  render() {
    this.selectTab(this.props.routeParams);
    return <ViewerComponent {...this.props} />;
  }
}

ViewerRoute.defaultProps = {
  params: {},
};

export default ViewerRoute;
