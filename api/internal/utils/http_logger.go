package utils

import (
	"log"
	"sync"
	"time"
)

type HTTPLogEntry struct {
	Method     string
	URLPath    string
	RemoteAddr string
	UserAgent  string
	Duration   time.Duration
}

type AsyncHTTPLogger struct {
	logChannel chan HTTPLogEntry
	wg         sync.WaitGroup
}

func NewAsyncHTTPLogger() *AsyncHTTPLogger {
	logger := &AsyncHTTPLogger{
		logChannel: make(chan HTTPLogEntry, 100), // Buffered channel to handle logs
	}
	logger.wg.Add(1)
	go logger.processLogs()
	return logger
}

// Log sends a log entry to the channel.
func (l *AsyncHTTPLogger) Log(method, urlPath string, remoteAddr string, userAgent string, duration time.Duration) {
	l.logChannel <- HTTPLogEntry{
		Method:     method,
		URLPath:    urlPath,
		RemoteAddr: remoteAddr,
		UserAgent:  userAgent,
		Duration:   duration,
	}
}

// Close stops the logger and waits for any remaining log entries to be processed.
func (l *AsyncHTTPLogger) Close() {
	close(l.logChannel)
	l.wg.Wait()
}

func (l *AsyncHTTPLogger) processLogs() {
	defer l.wg.Done()
	for entry := range l.logChannel {
		log.Printf("%s %s %s %s %v\n",
			entry.Method,
			entry.URLPath,
			entry.RemoteAddr,
			entry.UserAgent,
			entry.Duration,
		)
	}
}
