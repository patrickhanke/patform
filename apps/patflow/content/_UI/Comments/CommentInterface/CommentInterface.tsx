import React, { useCallback } from 'react';
import CreateComment from './components/CreateComment';
import Comment from './components/Comment';
import { CommentInterfaceProps } from './types';
import styles from './CommentInterface.module.scss';
import { Comment as CommentType } from '@types';
import { Loader } from '@repo/ui';

function sortCommentsByCreatedAt(comments: CommentType[]): CommentType[] {
    const commentsCopy = [...comments];
    return commentsCopy.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

const CommentInterface = ({ comments, addComment }: CommentInterfaceProps) => {
    const addCommentHandler = useCallback(
        async (value: CommentType) => {
            const commentsCopy = [...comments];
            commentsCopy.push(value);

            addComment(commentsCopy);
        },
        [addComment]
    );

    if (comments)
        return (
            <div className={styles.comment_interface}>
                <div className={styles.comment_interface_content}>
                    {sortCommentsByCreatedAt(comments).map(
                        (comment: CommentType) => (
                            <Comment
                                key={comment.createdAt}
                                comment={comment}
                            />
                        )
                    )}
                </div>
                <div className={styles.comment_interface_footer}>
                    <CreateComment addCommentHandler={addCommentHandler} />
                </div>
            </div>
        );
    return (
        <Loader
            width="100%"
            height="120px"
        />
    );
};

export default CommentInterface;
