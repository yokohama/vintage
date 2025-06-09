"use client";

import { useState } from "react";

/**
 * モーダル表示を管理するカスタムフック
 * 
 * @returns {Object} モーダル関連の状態と関数
 * @property {boolean} isModalOpen - モーダルが開いているかどうか
 * @property {Function} handleOpenModal - モーダルを開く関数
 * @property {Function} handleCloseModal - モーダルを閉じる関数
 * @property {Function} toggleModal - モーダルの開閉状態を切り替える関数
 */
export const useModal = (initialState = false) => {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  /**
   * モーダルを開く関数
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  /**
   * モーダルを閉じる関数
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * モーダルの開閉状態を切り替える関数
   */
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    toggleModal,
  };
};
