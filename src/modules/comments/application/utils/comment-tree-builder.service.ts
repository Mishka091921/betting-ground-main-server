// CommentData stays strict

import { CommentData } from "../../domain/interfaces/comment-interface";

export class CommentTreeBuilder {
  static build(raw_comments: Omit<CommentData, 'replies'>[], is_authenticated: boolean): CommentData[] {
    const commentMap = new Map<string, CommentData>();

    // Normalize comments and add replies array
    const normalizedComments: CommentData[] = raw_comments.map(c => ({
      ...c,
      parent_comment_document_id: c.parent_comment_document_id || '', // null → ''
      replies: [],
    }));

    // Fill the map
    normalizedComments.forEach(comment => {
      commentMap.set(comment.documentId, comment);
    });

    const rootComments: CommentData[] = [];

    // Build tree structure
    normalizedComments.forEach(comment => {
      if (comment.parent_comment_document_id === '') {
        rootComments.push(comment);
      } else {
        const parentComment = commentMap.get(comment.parent_comment_document_id ?? '');
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      }
    });

    // Mask if not authenticated
    if (!is_authenticated) {
      this.maskContentRecursive(rootComments);
    }

    return rootComments;
  }

  private static maskContentRecursive(comments: CommentData[]): void {
    comments.forEach(comment => {
      if (comment.is_private) {
        comment.content = '******';
      }
      if (comment.replies.length > 0) {
        this.maskContentRecursive(comment.replies);
      }
    });
  }
}
