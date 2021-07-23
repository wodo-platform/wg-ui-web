import IPagination from "@/services/common/IPagination";
import {IProfile,IArticle,IArticleAddCommentRequestParams,IArticleCreateRequestParams,IArticleGetListRequestParams,IArticleList,IArticleUpdateRequestParams,IComment} from "./models";
import WodoApiInstance from "./WodoApiBase";
import {articleMock2,articleListMock,commentMock} from "./mock.data"
const ARTICLES_PATH = "/articles";







export const ArticleGetList = async (params: IArticleGetListRequestParams): Promise<IArticleList> => {
  //const res = await WodoApiInstance.get(ARTICLES_PATH, { params });
  //return res?.data as IArticleList;
  return articleListMock;
};

export const ArticleGetFeed = async (params: IPagination): Promise<IArticleList> => {
  //const res = await WodoApiInstance.get(`${ARTICLES_PATH}/feed`, {params});
  //return res?.data as IArticleList;
  return articleListMock;
};

export const ArticleGet = async (slug: string): Promise<IArticle> => {
  //const res = await WodoApiInstance.get(`${ARTICLES_PATH}/${slug}`);
  //return res?.data?.article as IArticle;
  return articleMock2;
};

export const ArticleCreate = async (params: IArticleCreateRequestParams): Promise<IArticle> => {
  //const res = await WodoApiInstance.post(ARTICLES_PATH, {article: params});
  //return res?.data?.article as IArticle;
  return articleMock2;
};

export const ArticleUpdate = async (slug: string,params: IArticleUpdateRequestParams): Promise<IArticle> => {
  //const res = await WodoApiInstance.put(`${ARTICLES_PATH}/${slug}`, {article: params});
  //return res?.data?.article as IArticle;
  return articleMock2;
};

export const ArticleDelete = async (slug: string): Promise<IArticle> => {
  //const res = await WodoApiInstance.delete(`${ARTICLES_PATH}/${slug}`);
  //return res?.data?.article as IArticle;
  return articleMock2;
};



export const ArticleAddComment = async (slug: string, params: IArticleAddCommentRequestParams): Promise<IComment> => {
  /*const res = await WodoApiInstance.post(
    `${ARTICLES_PATH}/${slug}/comments`,
    {
      comment: params
    }
  );
  return res?.data?.comment as IComment;*/
  commentMock.body = params.body;
  return commentMock;
};

export const ArticleGetComments = async (slug: string): Promise<IComment[]> => {
  const res = await WodoApiInstance.get(
    `${ARTICLES_PATH}/${slug}/comments`
  );
  return res?.data?.comments as IComment[];
};

export const ArticleDeleteComment = async (
  slug: string,
  commentId: number
): Promise<void> => {
  await WodoApiInstance.delete(
    `${ARTICLES_PATH}/${slug}/comments/${commentId}`
  );
};

export const ArticleAddToFavorites = async (
  slug: string
): Promise<IArticle> => {
  const res = await WodoApiInstance.post(
    `${ARTICLES_PATH}/${slug}/favorite`
  );
  return res?.data?.article as IArticle;
};

export const ArticleRemoveFromFavorites = async (
  slug: string
): Promise<IArticle> => {
  const res = await WodoApiInstance.delete(
    `${ARTICLES_PATH}/${slug}/favorite`
  );
  return res?.data?.article as IArticle;
};