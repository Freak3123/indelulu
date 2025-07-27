'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FiSend, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';

type Post = {
  link: string;
  caption: string;
  createdAt: string;
  likes: number;
};

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 dark:bg-black/60">
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-md overflow-hidden w-full max-w-[85rem] h-[90vh] flex"
      >
        {/* Left: Image */}
        <div className="w-[60%] h-full relative">
          <Image
            src={post.link}
            alt="Post"
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="w-[40%] h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600" />
              <span className="font-semibold text-sm">ashreetapatra</span>
            </div>
            <FiMoreHorizontal className="text-xl cursor-pointer" />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {/* Caption */}
            <p className="text-sm">
              <span className="font-semibold mr-1">ashreetapatra</span>
              {post.caption}
            </p>

            {/* Example comments */}
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="font-semibold text-black dark:text-white">aj_aakashh</span> Bruuhhhhh......last one 👌🏻🔥</p>
              <p><span className="font-semibold text-black dark:text-white">__an_aesthete__</span> Just Heart!! ❤️❤️</p>
              <p><span className="font-semibold text-black dark:text-white">pratyush.88</span> Bahut badhiya ❤️</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-2xl mb-2">
              <div className="flex gap-4 items-center">
                <button onClick={handleLike} aria-label="Like">
                  {liked ? (
                    <AiFillHeart className="text-red-500" />
                  ) : (
                    <AiOutlineHeart className="text-black dark:text-white" />
                  )}
                </button>
                <FiSend className="cursor-pointer text-black dark:text-white" />
                <FiBookmark className="cursor-pointer text-black dark:text-white" />
              </div>
            </div>
            <div className="text-sm font-medium mb-1">
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{post.createdAt}</div>
          </div>

          {/* Comment input */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
