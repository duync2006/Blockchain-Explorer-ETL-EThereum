class EntityType:
    BLOCK = 'block'
    TRANSACTION = 'transaction'
    RECEIPT = 'receipt'
    LOG = 'log'
    TOKEN_TRANSFER = 'token_transfer'
    CONTRACT = 'contract'
    TOKEN = 'token'
    GETH_TRACE = 'geth_trace'
    TRACE = 'trace'
    
    ONLY_TRACE = [TRACE]
    ALL_FOR_STREAMING = [BLOCK, TRANSACTION, LOG, TOKEN_TRANSFER, TRACE, CONTRACT, TOKEN]
    DECODE_LOG = [BLOCK, TRANSACTION, LOG]
    ALL_FOR_INFURA = [BLOCK, TRANSACTION, LOG, TOKEN_TRANSFER]
