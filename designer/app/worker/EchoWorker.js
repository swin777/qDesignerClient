	/**
 	 * 받은 메시지를 그대로 돌려주는 워커 - 동기 처리 하기가 부담스러운 작업을 피하기 위해 사용
 	 */

	addEventListener("message", messageHandler, true);
	
	/**
	 * async worker 
	 */	
	function messageHandler(e) {
		postMessage(e.data);
	}	