import { push } from 'connected-react-router';
import { put, call, takeLatest, all, select, take, delay } from 'redux-saga/effects';
import * as SorterActions from './sorterResultsActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { startRequest, endRequest } from './../app/appActions';
import { saveSorterResult, getSorterResultById, getSorterResultList } from './../apiCalls';
import { incrementTakeCount } from './../sorters/sortersActions';
import { del } from 'idb-keyval';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const getAccessToken = (state) => state.auth.accessToken;
const getIdbStore = (state) => state.app.idbStore;

const STORAGE_KEY = 'SORTER_PROGRESS_';

function* processNewResultSubmit({ sorterResult }) {
    yield put(startRequest());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) accessToken = yield select(getAccessToken);
        }
        const res = yield call(saveSorterResult, sorterResult, accessToken);
        const idbStore = yield select(getIdbStore);
        if (idbStore) yield call(del, STORAGE_KEY + sorterResult.sorter_id, idbStore);
        yield put(actions.resolveNewSorterResult(res.data));
        yield put(incrementTakeCount(sorterResult.sorter_id));
        yield delay(300);
        yield put(push(`/results/${res.data._id}?share=true`));
    } catch {
        //TODO general frontend handling of errors
        //yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

function* processGetResult({ id, getUserInfo }) {
    yield put(startRequest());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else {
                accessToken = null;
            }
        }
        const res = yield call(getSorterResultById, id, accessToken, getUserInfo);
        yield put(actions.resolveGetSorterResult(res.data));
    } catch {
        //TODO general frontend handling of errors
        //yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

export function* processGetResults({ idList }) {
    yield put(startRequest());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else {
                accessToken = null;
            }
        }
        const res = yield call(getSorterResultList, idList);
        yield put(actions.populateSorterResults(res.data));
    } catch {
        //TODO general frontend handling of errors
        //yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

function* watchNewResultSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_RESULT_START, processNewResultSubmit);
}

function* watchGetResult() {
    yield takeLatest(SIGNALS.GET_SORTER_RESULT_START, processGetResult);
}

export default function* () {
    yield all([watchNewResultSubmit(), watchGetResult()]);
}
