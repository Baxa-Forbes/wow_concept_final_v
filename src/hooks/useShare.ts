export function useShare(showToast: (msg: string) => void) {
  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(url);
        showToast('Ссылка на галерею скопирована в буфер');
        return;
      }
    } catch {
      // Ignore
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) {
        showToast('Ссылка на галерею скопирована в буфер');
        return;
      }
    } catch {
      // execCommand also blocked
    }

    showToast('Ссылка: ' + window.location.host);
  };

  const handleShare = async (title?: string) => {
    const text = title
      ? `WOW CONCEPT Gallery · ${title}`
      : 'WOW CONCEPT · Contemporary Art Gallery & Concierge';
    const shareData = {
      title: text,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    await copyToClipboard();
  };

  return { handleShare };
}
